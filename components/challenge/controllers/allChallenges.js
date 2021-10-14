const createError = require("http-errors");

const Challenge = require('../challenge.model')
const Solution = require('./../../student/solution.model')

async function getAllChallenges(req, res, next) {
  let allChallenges = await Challenge.find(
    {},
    'title points level description category',
  ).lean().cache({ expire: 30 * 60, key: `challenges` })


  allChallenges = JSON.parse(JSON.stringify(allChallenges))

  let challengesCount = await Challenge.find({}).countDocuments()

  let _challenges = []
  for (let i in allChallenges) {
    solved = await Solution.findOne({
      student: req.userData._id,
      challenge: allChallenges[i]._id,
    })
    solved
      ? (allChallenges[i]['solved'] = true)
      : (allChallenges[i]['solved'] = false)
    _challenges.push(allChallenges[i])
  }

  return res
    .status(200)
    .json({ count: challengesCount, challenges: _challenges })
}

module.exports = getAllChallenges
