const createError = require('http-errors')

const { clearHash } = require("./../../../utils/caching");
const Field = require('../fields.model')
const catchAsync = require('../../../utils/catchAsync')
const { fieldName: fieldSchema } = require('../student.validation')

addField = catchAsync(async (req, res, next) => {
  try {
    const { error, value } = fieldSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, '') })

    let fieldName = await Field.findOne({ fieldName: value.fieldName })
      .select('fieldName -createdAt -updatedAt')
      .lean();

    if (fieldName)
      return res.status(409).json({
        message: 'Field Name already Found before',
        status: 409,
      })
    await Field.create({ fieldName: value.fieldName })
    clearHash('fields');

    return res.status(200).json({
      message: 'Field Name Added Successfully',
      status: 200,
    })
  } catch (error) {
    return next(createError(500, error))
  }
})

module.exports = addField
