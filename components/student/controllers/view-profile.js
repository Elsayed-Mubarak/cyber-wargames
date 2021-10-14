const mongoose = require('mongoose')

const Student = require('../student.model')
const Solution = require('../solution.model')
const Challenge = require('../../challenge/challenge.model')

async function viewProfile(req, res) {
  let studentID = req.userData._id;
  if (req.params.id) studentID = req.params.id

  if (!mongoose.Types.ObjectId.isValid(studentID))
    return res.status(400).send({ message: 'Invalid student' })
  let student;
  
  if (req.params.id) {
    student = await Student.findOne(
      { _id: mongoose.Types.ObjectId(studentID), isVerified: true },
      '-role -password -otpNextResendAt  -otpRequestCounter -forgotPasswordResetCounter -otp -__v -leader -isVerified -active -createdAt -updatedAt',
    ).cache({ expire: 30 * 60, key: `view-profile ${studentID}` })
  } else {
    student = await Student.findOne(
      { _id: mongoose.Types.ObjectId(studentID), isVerified: true },
      '-password -otpNextResendAt  -otpRequestCounter -forgotPasswordResetCounter -otp -__v -leader -isVerified -active -createdAt -updatedAt',
    ).cache({ expire: 30 * 60, key: `view-profile ${studentID}` })
  }


  if (!student) return res.status(409).json({ message: 'student not found' })

  // there will be problem here in the future in Student.find because
  // we return all students in DB
  const [solutions, sortedUsers, totalChallenges] = await Promise.all([
    Solution.find(
      { student: studentID },
      'challenge points updatedAt',
    )
      .sort({ updatedAt: -1 })
      .populate('challenge', 'title description category _id'),
    // there will be problem here in the future
    Student.find(
      { role: 'user' },
      'name score squadNumber',
      {
        sort: { score: -1, updatedAt: 1 },
      },
    ),
    Challenge.find({}).countDocuments()
  ])

  let teamRank = sortedUsers.findIndex((x) => x.name == student.name)

  student = JSON.parse(JSON.stringify(student))
  student['solutions'] = solutions
  student['rank'] = +teamRank + 1
  student['totalChallenges'] = +totalChallenges

  return res.status(200).send(student)
}

module.exports = viewProfile
