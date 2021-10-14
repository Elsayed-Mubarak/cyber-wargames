const mongoose = require("mongoose");
const Challenge = require("../challenge.model");
const {
  challengeUpdate: challengeUpdateSchema,
} = require("../challenge.validate");

async function updateChallenge(req, res, next) {
    let challengeID = req.params.challengeId;
    if (!mongoose.Types.ObjectId.isValid(challengeID))
      return res.status(400).send({ message: "Invalid challenge" });

    const { error, value } = challengeUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, "") });

    if (value && Object.keys(value).length === 0)
      return res
        .status(400)
        .json({ message: "Cann't update challenge without valid inputs" });

    const challenge = await Challenge.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(challengeID) },
      value
    );
    if (!challenge)
      return res.status(400).json({ message: "Challenge editing failed" });

    return res
      .status(200)
      .json({ message: "Challenge updated successfully", updated: true });
}

module.exports = updateChallenge;
