const mongoose = require("mongoose");
const Challenge = require("../challenge.model");
const Student = require("../../student/student.model");
const Solution = require("../../student/solution.model");
const Socket = require("../../../socket");

async function requestHint(req, res) {
  let challengeID = req.params.challengeId;
  // check challenge ID
  if (!mongoose.Types.ObjectId.isValid(challengeID))
    return res.status(400).json({ message: "Invalid Challenge" });

  // check if team exists
  let student = await Student.findById(req.userData._id);
  if (!student)
    return res.status(401).json({ message: "Unauthorized Student not found" });

  // check if challenge exists
  let challenge = await Challenge.findById(challengeID);
  if (!challenge)
    return res
      .status(401)
      .json({ message: "Unauthorized Challenge not found" });

  if (challenge.hints.length === 0) {
    return res
      .status(400)
      .json({ message: "There's not hint exists for this challenge" });
  }

  // check if challenge not solved before
  let solved = await Solution.findOne({
    challenge: mongoose.Types.ObjectId(challengeID),
    student: mongoose.Types.ObjectId(req.userData._id),
  }).select('_id');

  if (solved)
    return res.status(409).json({ message: "Challenge Already solved" });

  let challengeHints = student.challengesHints;
  for (let i = 0; i < challengeHints.length; i++) {
    if (student.challengesHints[i] == challengeID) {
      return res.status(201).send({ hint: challenge.hints[0] });
    }
  }

  let hint = challenge.hints[0];

  student.score -= 0.3 * challenge.points;
  if (student.score < 0)
    return res
      .status(400)
      .json({ message: "student not have enough points to pay hint" });

  student.challengesHints.push(challengeID);
  // student.scoreUpdate = new Date();
  student.save();

  Socket.updateDashboard();

  return res.status(200).send({ hint, score: student.score });
}

module.exports = requestHint;
