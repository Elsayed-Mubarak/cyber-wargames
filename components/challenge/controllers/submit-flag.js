const mongoose = require('mongoose')
const Mutex = require('async-mutex')
const mutex = new Mutex.Mutex() // creates a shared mutex instance

const Challenge = require('../challenge.model')
const Solution = require('../../student/solution.model')
const Student = require('../../student/student.model')
const { flag: flagValidation } = require('../challenge.validate')

const Socket = require('./../../../socket')

async function submitFlag(req, res) {
  const release = await mutex.acquire() // acquires access to the critical path
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.challengeId))
      return res.status(400).send({ message: 'Invalid Challenge' })

    const { error, value } = flagValidation.validate(req.body)
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, '') })


    let student = await Student.findById(req.userData._id)
    if (!student)
      return res.status(401).json({ error: 'Unauthorized student not found' })

    let challenge = await Challenge.findById(req.params.challengeId)
    if (!challenge)
      return res.status(429).json({ error: 'Challenge not found' })

    let solved = await Solution.findOne({
      challenge: mongoose.Types.ObjectId(req.params.challengeId),
      student: mongoose.Types.ObjectId(req.userData._id),
    })
    if (solved)
      return res
        .status(409)
        .json({ message: 'Challenge already solved before' })
    value.challengeName = challenge.title
    value.student = req.userData._id
    value.challenge = req.params.challengeId

    if (challenge.flag === value.flag) {
      value.points = challenge.points
      student.score += challenge.points
      student.scoreUpdateAt = Date.now()
      const [solution, studentSaved] = await Promise.all([
        Solution.create(value),
        student.save(),
      ])
      // Socket.updateScore(student.score, student._id, solution);
      Socket.updateDashboard(student.score, student._id, solution, student.scoreUpdateAt)
      return res.status(200).json({ message: 'Challenge solved', solved: true })
    }
    return res
      .status(400)
      .json({ message: 'Flag(answer) incorrect.. Try Again', solved: false })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  } finally {
    release() // completes the work on the critical path
  }
}

module.exports = submitFlag
