const mongoose = require('mongoose');

// Schema
const Log = mongoose.Schema({
  state: String,
  label: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});


Log.methods.add = function (state, label, message) {
  this.state = state;
  this.label = label;
  this.message = message;
};

module.exports = mongoose.model('Log', Log);