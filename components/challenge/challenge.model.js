const mongoose = require("mongoose");

const Challenge = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: { type: String, default: "" },
    category: { type: String },
    externalLink: { type: String },
    level: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    author: { type: String, default: "ISEC" },

    flag: { type: String },

    hintLevel: { type: Number, default: 0 }, // to variety of hints and score
    hints: [String], //The actual hints
  },
  { timestamps: true, usePushEach: true }
);

module.exports = mongoose.model("Challenge", Challenge);
