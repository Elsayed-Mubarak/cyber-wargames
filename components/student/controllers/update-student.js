const mongoose = require('mongoose')

const Student = require('../student.model')
const { militaryId: militaryIdValidation } = require('../student.validation')

async function updateStudent(req, res) {

  let studentId = req.params.studentId
  if (!mongoose.Types.ObjectId.isValid(studentId))
    return res.status(400).send({ message: 'Invalid studentId' })

  const { error, value } = militaryIdValidation.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })

  let isExists = await Student.findOne({ militaryId: value.militaryId });
  if (isExists)
    return res
      .status(429)
      .json({ message: 'MilitaryId Already exists' })

  const student = await Student.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(studentId) },
    value,
  )
  if (!student)
    return res.status(400).json({ message: 'Student editing failed' })

  return res
    .status(200)
    .json({ message: 'Student militaryId updated successfully' })
}

module.exports = updateStudent
