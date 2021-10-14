const express = require('express');
const router = express.Router();

const catchAsync = require('../../utils/catchAsync')
const Security = require('./../../security');

const {
	createChallenge,
	updateChallenge,
	getChallenge,
	challengesByCat,
	getAllChallenges,
	downloadFile,
	submitFlag,
	removeChallenge,
	requestHint
} = require('./controllers');

router.post('/create-challenge-v01', Security.auth(['superadmin','admin']), catchAsync(createChallenge));
router.patch('/challenge-v01/:challengeId', Security.auth(['superadmin']), catchAsync(updateChallenge));

router.get('/all', Security.auth(['superadmin','admin','user']), catchAsync(getAllChallenges));
router.get('/:challengeId', Security.auth(['superadmin', 'user']), catchAsync(getChallenge));
router.get('/category/:cat', Security.auth(['superadmin', 'user']), catchAsync(challengesByCat));
router.get('/download/:name', Security.auth(['user']), downloadFile);

router.post("/answer/:challengeId", Security.auth(['user', 'superadmin']), submitFlag);
router.get("/hint/:challengeId", Security.auth(['user']), catchAsync(requestHint));

router.delete('/:challengeId', Security.auth(['superadmin']), catchAsync(removeChallenge));

module.exports = router;
