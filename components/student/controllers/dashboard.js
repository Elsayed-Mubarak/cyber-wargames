const Student = require('../student.model');
const { pagination: paginationSchema } = require('../student.validation');

async function dashboard(req, res, next) {
	let { error, value } = paginationSchema.validate(req.query, { stripUnknown: true });
	if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

	if (!value.limitNo) value.limitNo = 30;
	if (!value.pageNo) value.pageNo = 0;

	const queryLimitNo = Number.parseInt(value.limitNo);
	const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

	const [students, count] = await Promise.all([
		Student.find({ role: 'user' })
			.skip(querySkipNo)
			.limit(queryLimitNo),
		Student.find({ role: 'user', isVerified: true }).countDocuments()
	]);

	return res.status(200).json({ students, count });
}

module.exports = dashboard;
