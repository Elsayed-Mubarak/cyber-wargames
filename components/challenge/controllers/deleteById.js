const mongoose = require("mongoose");

const Challenge = require("../challenge.model");

async function removeChallenge(req, res, next) {
  let challengeID = req.params.challengeId;
  if (!mongoose.Types.ObjectId.isValid(challengeID))
    return res.status(400).json({ message: "Invalid Challenge" });

  let challenge = await Challenge.findByIdAndDelete({ _id: challengeID });
  if (!challenge)
    return res.status(404).json({ message: "Challenge not found" });

  return res.status(200).json({ message: "Challenge Removed Successfully" });
}

module.exports = removeChallenge;
