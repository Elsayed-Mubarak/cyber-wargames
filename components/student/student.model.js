const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')

const Student = new mongoose.Schema(
  {
    militaryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userID: { type: String, unique: true, default: "" },
    squadNumber: { type: String },
    score: { type: Number, default: 0 },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    challengesHints: [],
    scoreUpdateAt: { type: Date, default: Date.now },

    active: { type: Boolean, default: true },
    role: { type: String, default: 'user' },
  },
  { usePushEach: true, timestamps: true },
) /// to make the array push available in DB

Student.index({ militaryId: 1 })



Student.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password)
}

Student.query.byMilitaryId = function (militaryId) {
  return this.where({ militaryId: new RegExp(militaryId, 'i') })
}

Student.query.byID = function (id) {
  return this.where({ _id: mongoose.Types.ObjectId(id) })
}

Student.pre('find', function (next) {
 // this.find({ role: 'user' })
  this.select('_id name squadNumber militaryId score scoreUpdateAt')
  this.sort({ score: -1, scoreUpdateAt: 1 })
  next()
})


Student.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.userID = await uuid.v5(this.id, uuid.v5.URL);

})

module.exports = mongoose.model('Student', Student)
