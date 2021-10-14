const mongoose = require("mongoose");
const Challenge = require("../challenge.model");
const Student = require("../../student/student.model");
const Solution = require("../../student/solution.model");
const { category: categoryValidation } = require("../challenge.validate");

async function challengesByCat(req, res, next) {
  req.body.category = req.params.cat;
  const { error, value } = categoryValidation.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.message.replace(/"/g, "") });

  let student = await Student.findById(req.userData._id).select('_id');
  if (!student)
    return res.status(401).json({ message: "Unauthorized student" });

  let challenges = await Challenge.find(
    { category: value.category },
    `_id title category points level`
  );
  if (!challenges) res.status(200).send(challenges);

  challenges = JSON.parse(JSON.stringify(challenges));

  for (let challenge in challenges) {
    solved = await Solution.findOne({
      challenge: mongoose.Types.ObjectId(challenge._id),
      student: mongoose.Types.ObjectId(req.userData._id),
    });
    solved
      ? (challenges[challenge]["solved"] = true)
      : (challenges[challenge]["solved"] = false);
  }

  return res.status(200).send(challenges);
}

module.exports = challengesByCat;