const Student = require('../student.model')
const createError = require("http-errors");
const { deleteSquad: deleteSquadSchema } = require('../student.validation')
const mongoose = require('mongoose')
deleteSquad = async (req, res, next) => {
  const { error, value } = deleteSquadSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ message: error.message.replace(/"/g, ''), status: 400 })


  if (!mongoose.Types.ObjectId.isValid(req.userData._id))
    return res.status(400).json({ message: 'Invalid admin id' })

  let admin = await Student.findById({
    _id: mongoose.Types.ObjectId(req.userData._id),
  })

  if (!admin) {
    return next(createError(401, 'Unauthorized user'))
  }
  const isPasswordValid = await admin.isPasswordValid(value.password)
  if (!isPasswordValid) return next(createError(401, 'Invalid password Unauthorized'))


  await Student.deleteMany({
    squadNumber: { $eq: value.squadNumber },
    role: 'user'
  });

  return res.status(200).json({ message: 'Squad Removed Successfully' })
}
module.exports = deleteSquad
