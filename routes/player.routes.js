const express = require("express");

const { Player } = require("../models/Player.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const playerList = await Player.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Player.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: playerList,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const player = await Player.findById(id);
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const player = await Player.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (player?.length) {
      res.json(player);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const player = new Player(req.body);

    const createdPlayer = await player.save();
    return res.status(201).json(createdPlayer);
  } catch (error) {
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playerDeleted = await Book.findByIdAndDelete(id);
    if (playerDeleted) {
      res.json(playerDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playerUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (playerUpdated) {
      res.json(playerUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

module.exports = { playerRouter: router };