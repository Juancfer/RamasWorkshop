const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Team } = require("../models/Team.js");
const { Player } = require("../models/Player.js");
const { generateRandom } = require("../utils.js");

let teamList = [
  {
    name: "Alex",
  },
  {
    name: "Dani",
  },
];

const teamSeed = async () => {
  try {
    // CONEXION
    const database = await connect();
    console.log("Tenemos conexion");

    const Player = await Player.find();

    // BORRADO
    await Team.collection.drop();
    console.log("Borrado de playList");

    // CREACION DOCUMENTOS
    team = team.map((team) => {
      const randomSongs = songs[generateRandom(0, songs.length - 1)];
      const randomUsers = users[generateRandom(0, users.length - 1)];

      team.song = randomSongs.id;
      team.user = randomUsers.id;

      return new Team(team);
    });

    await Team.insertMany(team);
    console.log("PlayList creadas correctamente");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

teamSeed();
