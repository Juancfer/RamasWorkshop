const express = require("express");

const { Team } = require("../models/Team.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const teamList = await Team.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Team.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: teamList,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const team = await Team.findById(id);
    if (team) {
      res.json(team);
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
    const team = await Team.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (team?.length) {
      res.json(team);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const team = new Team(req.body);

    const createdTeam = await team.save();
    return res.status(201).json(createdTeam);
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
    const teamDeleted = await Team.findByIdAndDelete(id);
    if (teamDeleted) {
      res.json(teamDeleted);
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
    const teamUpdated = await Team.findByIdAndUpdate(id, req.body, { new: true });
    if (teamUpdated) {
      res.json(teamUpdated);
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

module.exports = { teamRouter: router };