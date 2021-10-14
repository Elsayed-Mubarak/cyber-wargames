const { clearHash } = require("./../../../utils/caching");
const Squad = require('../squad.model')

const { squadNumber: squadNumberSchema } = require('../student.validation')

addSquad = async (req, res, next) => {
  const { error, value } = squadNumberSchema.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, '') })

  let squadNumber = await Squad.findOne({ squadNumber: value.squadNumber }).lean()

  if (squadNumber)
    return res.status(409).json({
      message: 'Squad Number already Founded before',
      status: 409,
    })

  await Squad.create({ squadNumber: value.squadNumber })
  clearHash('squads');

  return res.status(200).json({
    message: 'Squad Number Added Successfully',
    status: 200,
  })
}

module.exports = addSquad
