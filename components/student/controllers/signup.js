const Student = require('../student.model')
const Security = require('./../../../security')
const { signup: signupSchema } = require('../student.validation')

signup = async (req, res, next) => {
  const { error, value } = signupSchema.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })

  let student = await Student.findOne({ militaryId: value.militaryId })

  if (student && student.militaryId === value.militaryId)
    return res
      .status(409)
      .json({ message: 'Student already registered before', status: 409 })

  value.isVerified = true
  student = await Student.create(value)

  let token = await Security.buildTicket(student, req.socket.remoteAddress);
  req.session.user_sid = { userId: student.userID, role: student.role };
  req.session.save();

  await Security.setCookies(req, res, token);

  return res.status(200).send({
    token, verified: true,
    role: student.role
  });
}

module.exports = signup
