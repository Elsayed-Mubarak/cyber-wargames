const Squad = require('../squad.model')

getSquadNumbers = async (req, res, next) => {
  let squadNumbers = await Squad.find().select('-_id -__v -createdAt -updatedAt').lean().cache({ expire: 24 * 60 * 60, key: `squads` });
  return res.status(200).send(squadNumbers)
}



module.exports = getSquadNumbers
