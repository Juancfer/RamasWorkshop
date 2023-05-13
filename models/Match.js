const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Team } = require("./Team.js");

const match = new Schema(
  {
    homeClub: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: Team,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: Team,
    },
    goalScored: {
      type: Number,
      required: true,
    },
    goalRecived: {
      type: Number,
      required: true,
    },
    matchPlayed: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Match = mongoose.model("Match", match);
module.exports = { Match };
