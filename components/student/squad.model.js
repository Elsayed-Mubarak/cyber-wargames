const mongoose = require('mongoose')

const Squad = new mongoose.Schema(
  {
    squadNumber: { type: Number, require: true },
  },
  { usePushEach: true, timestamps: true },
) 

module.exports = mongoose.model('Squad', Squad)
