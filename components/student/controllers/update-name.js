const createError = require('http-errors');

const Student = require('../student.model');
const { studentName: studentNameValidation } = require('../student.validation');

async function updateName(req, res, next) {

	const { error, value } = studentNameValidation.validate(req.body);
	if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

	const student = await Student.findById(req.userData._id);
	if (!student) return res.status(401).send({ message: 'Unauthorized student not exists' });

	student.name = value.name;
	await student.save();
	return res.status(200).send({ message: 'Student name updated successfully' });
}

module.exports = updateName;
