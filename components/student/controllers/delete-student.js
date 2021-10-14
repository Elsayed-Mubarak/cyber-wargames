const Student = require('../student.model')

async function deleteStudent(req, res) {
  let studentID = req.params.studentId;
  let student = await Student.findOneAndDelete({ _id: studentID, role: 'user' })
  if (!student) return res.status(409).json({ message: 'student not found' })

  return res.status(200).json({ message: 'Student deleted successfully' })
}

module.exports = deleteStudent
