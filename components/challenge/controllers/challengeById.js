const mongoose = require('mongoose');

const Challenge = require('../challenge.model');
const Solution = require('../../student/solution.model');

async function getChallenge(req, res) {
	let challengeID = req.params.challengeId;
	if (!mongoose.Types.ObjectId.isValid(challengeID))
		return res.status(400).json({ message: 'Invalid Challenge' });

	let solutions = await Solution.findOne({
		challenge: mongoose.Types.ObjectId(challengeID),
		student: mongoose.Types.ObjectId(req.userData._id),
	}).select('_id');

	let challenge = await Challenge.findById(challengeID, `title category points level description externalLink`);
	if (!challenge) return res.status(404).send({ message: 'challenge not exists' });

	challenge = JSON.parse(JSON.stringify(challenge));
	challenge['solved'] = false;

	if (solutions) challenge['solved'] = true;

	return res.status(200).send(challenge);
}

module.exports = getChallenge;
