const signup = require('./signup')
const login = require('./login')
const updatePassword = require('./update-password')
const viewProfile = require('./view-profile')
const updateName = require('./update-name')
const dashboard = require('./dashboard')
const logout = require('./logout')
const generateCredentials = require('./generate-credentials')
const getAllAdmins = require('./get-admins')
const createAdmin = require('./create-admin')
const deleteStudent = require('./delete-student')
const deleteAdmin = require('./delete-admin')

const getStudentsBySquadNumber = require('./getStudentsBySquadNumber')
const resetPassword = require('./reset-password')
const updateStudent = require('./update-student')
const deleteSquad = require('./delete-squad')
const getSquadNumbers = require('./get-squadNumbers')

const addSquadNumber = require('./add-squadNumber')
const addFieldName = require('./add-field')
const getfieldsName = require('./get-fields')
module.exports = {
  signup,
  login,
  updatePassword,
  getStudentsBySquadNumber,
  deleteStudent,
  deleteAdmin,
  getSquadNumbers,
  deleteSquad,
  updateStudent,
  getAllAdmins,
  addSquadNumber,
  addFieldName,
  getfieldsName,
  createAdmin,
  viewProfile,
  generateCredentials,
  resetPassword,
  updateName,
  dashboard,
  logout,
}
