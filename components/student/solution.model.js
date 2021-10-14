const mongoose = require('mongoose');

const Solution = new mongoose.Schema(
	{
		challenge: { type: mongoose.Types.ObjectId, ref: 'Challenge', required: true },
		student: { type: mongoose.Types.ObjectId, ref: 'Student', required: true },
		flag: { type: String, required: true },
		points: { type: Number, default: 0 },
	},
	{ timestamps: true, usePushEach: true }
);

module.exports = mongoose.model('Solution', Solution);
