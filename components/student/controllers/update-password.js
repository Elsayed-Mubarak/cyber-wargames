const createError = require('http-errors');

const Student = require('../student.model');
const { changePassword: changePasswordSchema } = require('../student.validation');

updatePassword = async (req, res, next) => {
  const { error, value } = changePasswordSchema.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })

  const student = await Student.findOne().byID(req.userData._id);
  if (!student) return next(createError(401, 'Unauthorized student not exists'))

  const isPasswordValid = await student.isPasswordValid(req.body.oldPassword)
  if (!isPasswordValid) return next(createError(409, 'Old password incorrect'))

  if (value.oldPassword === value.newPassword)
    return next(
      createError(409, 'New password must not be the same as old password')
    )

  student.password = value.newPassword
  await student.save()
  return res.status(200).json({ message: 'Password Updated Successfully' })
}

module.exports = updatePassword
