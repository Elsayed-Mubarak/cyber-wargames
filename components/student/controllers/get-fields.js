const Field = require('../fields.model')
const createError = require('http-errors')
const catchAsync = require('../../../utils/catchAsync')

getfieldsName = catchAsync(async (req, res, next) => {
  try {

    let fieldsName = await Field.find().select('-_id -__v').lean().cache({ expire: 24 * 60 * 60, key: `fields` });

    return res.status(200).send(fieldsName)
  } catch (error) {
    return next(createError(500, error))
  }
})

module.exports = getfieldsName