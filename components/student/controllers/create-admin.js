const createError = require('http-errors');

const Student = require('../student.model')
const catchAsync = require('../../../utils/catchAsync')

const { adminSignup: adminSignupSchema } = require('../student.validation')

createAdmin = async (req, res) => {
  const { error, value } = adminSignupSchema.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })

  let student = await Student.findOne({ militaryId: value.militaryId })

  if (student && student.militaryId === value.militaryId)
    return res
      .status(409)
      .json({ message: 'Admin already registered before', status: 409 })

  value.isVerified = true
  value.role = 'admin'
  student = await Student.create(value)
  let createdAdmin = {
    _id: student._id,
    name: student.name,
    militaryId: student.militaryId,
  }
  return res.status(200).send(createdAdmin)
}

module.exports = createAdmin
