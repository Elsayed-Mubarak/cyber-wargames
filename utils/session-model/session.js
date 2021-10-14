const mongoose = require('mongoose');
const { Schema } = mongoose;

// generates random number
function getRandom () {
  return Math.floor(100000000 + Math.random() * 900000000);
}

// Schema
const Session = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  role: { type: String },
  // used for login devices
  sessions: [
    {
      urn: { type: Number },
      iat: { type: Number },
      exp: { type: Number }
    }
  ],
  // usuage rate limit per hour
  usage: {
    total: Number,
    span: Date,
    blocked: Boolean,
    ip: String,
    nextAt: Date
  },
  updatedAt: { type: Date, default: Date.now }
});

Session.methods.createFor = function (user, ipAddress) {
  this.user = user._id;
  this.usage = {
    total: 0, // total number of requests made by this user
    span: new Date(),
    blocked: false,
    ip: ipAddress,
    nextAt: new Date() // next time to be unblocked
  };
};

// create new random number
// {exp: , maxLogins:}
// returns ticket
Session.methods.newLogin = function (opts) {
  const ticket = {
    urn: getRandom(),
    exp: opts.exp,
    iat: opts.iat
  };
  this.sessions.unshift(ticket);
  if (this.sessions.length > opts.maxLogins) this.sessions.pop();
  return ticket;
};

// check if session exists and not expired
Session.methods.getLogin = function (urn) {
  const s = this.sessions.find(e => e.urn === urn);
  return (s) ? s : false;
};

// add to records
Session.methods.recordUsage = function () {
  this.usage.total++;
};

// block sessions usage
// nextAt
Session.methods.blockUsage = function (opts) {
  this.usage.blocked = true;
  this.usage.nextAt = opts.nextAt;
};

// reset usage to inital state after blocking 
Session.methods.resetUsage = function () {
  this.usage.total = 0;
  this.usage.span = new Date();
  this.usage.blocked = false;
  this.usage.nextAt = new Date();
};

Session.methods.removeSession = function (currentSession) {
  let index = this.sessions.findIndex(e => e.urn === currentSession.urn);
  this.sessions.splice(index, 1);
}

Session.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Session', Session);