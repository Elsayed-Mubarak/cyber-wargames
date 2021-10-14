let path = require('path');
const fs = require('fs');

const Team = require('./../team.model');

async function downloadTeams(req, res) {
	let pipe = [
		{ $match: { role: 'user', isVerified: true } },
		{ $sort: { score: -1, updatedAt: -1 } },
		{
			$project: {
				_id: 0,
				name: 1,
				score: 1,
				country: 1,
			},
		},
		{
			$addFields: {
				rank: { $sum: '$sum' },
			},
		},
	];

	const teams = await Team.aggregate(pipe);

	if (teams && teams.length > 0) {
		teams.forEach((team, index) => {
			team.rank = index + 1;
		});
	}

	const filePath = path.join(__dirname, '../../../', 'downloads/teams.json');

	fs.writeFile(
		filePath,
		JSON.stringify({
			standings: teams,
		}),
		function (err) {
			if (err) throw err;
			else {
				fs.access(filePath, fs.F_OK, err => {
					if (err)
						return res.status(400).json({
							error: 'file not exists',
						});
					// file exists
					return res.download(filePath); // Set disposition and send it.
				});
			}
		}
	);
}

module.exports = downloadTeams;
