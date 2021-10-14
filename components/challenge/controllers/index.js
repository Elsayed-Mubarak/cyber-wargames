const createChallenge = require('./create');
const updateChallenge = require('./update');
const getChallenge = require('./challengeById');
const challengesByCat = require('./challengesByCat');
const getAllChallenges = require('./allChallenges');
const downloadFile = require('./download');
const submitFlag = require('./submit-flag');
const removeChallenge = require('./deleteById');
const requestHint = require('./requestHint');

module.exports = {
  createChallenge,
  updateChallenge,
  getChallenge,
  challengesByCat,
  getAllChallenges,
  downloadFile,
  submitFlag,
  removeChallenge,
  requestHint
}