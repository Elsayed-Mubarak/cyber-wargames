const Student = require('../student.model')

async function deleteAdmin(req, res) {
  let adminID = req.params.adminId;
  let student = await Student.findOneAndDelete({ _id: adminID, role: 'admin' })
  if (!student) return res.status(409).json({ message: 'student not found' })

  return res.status(200).json({ message: 'Admin deleted successfully' })

}

module.exports = deleteAdmin
