const mongoose = require('mongoose')

const Student = require('../student.model')
const {
  resetPassword: resetPasswordValidation,
} = require('../student.validation')

async function resetPassword(req, res, next) {
  const { error, value } = resetPasswordValidation.validate(req.body)

  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })
  let studentId = req.params.studentId
  if (!mongoose.Types.ObjectId.isValid(studentId))
    return res.status(400).json({ message: 'Invalid studentId' })
  const student = await Student.findById({ _id: studentId })
  if (!student) return res.status(409).json({ message: 'Student not found' })

  student.password = value.password
  await student.save()
  return res.status(200).json({ message: 'Password Changed successfully' })
}

module.exports = resetPassword
