const Student = require('../student.model')

const { squadNumber: squadNumberSchema, pagination: paginationSchema } = require('../student.validation')
getStudentsBySquadNumber = async (req, res, next) => {
  var { error, value } = squadNumberSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ message: error.message.replace(/"/g, ''), status: 400 })

  let squadNumber = value.squadNumber;

  var { error, value } = paginationSchema.validate(req.query, { stripUnknown: true });
  if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });


  if (!value.limitNo) value.limitNo = 0;
  if (!value.pageNo) value.pageNo = 0;

  const queryLimitNo = Number.parseInt(value.limitNo);
  const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

  // console.time('default_query')
  const [students, count] = await Promise.all([
    Student.find({ role: 'user', squadNumber: squadNumber })
      .skip(querySkipNo)
      .limit(queryLimitNo)
      .lean(),
    Student.find({ role: 'user', isVerified: true, squadNumber }).countDocuments()
  ]);

  // console.timeEnd('default_query')

  if (!students || students.length === 0) {
    return res.status(200).send({ students, count })
  }

  return res.status(200).send({ students, count })
}

module.exports = getStudentsBySquadNumber
