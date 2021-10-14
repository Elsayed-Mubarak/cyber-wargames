const Student = require('../student.model')

getAllAdmins = async (req, res, next) => {
  let admins = await Student.find({ role: 'admin' }).select(
    '_id name militaryId',
  )

  if (admins.length === 0 || !admins) {
    return res.status(404).send({ message: 'No admins found' })
  }

  return res.status(200).send({ admins })
}

module.exports = getAllAdmins
