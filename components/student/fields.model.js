const mongoose = require('mongoose')

const Field = new mongoose.Schema(
  {
    fieldName: { type: String },
  },
  { usePushEach: true, timestamps: true },
) /// to make the array push available in DB

module.exports = mongoose.model('Field', Field)