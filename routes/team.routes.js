const express = require("express");

// Modelos
const { Team } = require("../models/Team.js");

const router = express.Router();

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const team = await Sample.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("child");

    // Num total de elementos
    const totalElements = await Team.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: team,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const team = await Team.findById(id).populate("child");
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const team = await Team.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate("child");
    if (team?.length) {
      res.json(team);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res) => {
  console.log(req.headers);

  try {
    const team = new Team({
      title: req.body.title,
      subtitle: req.body.subtitle,
    });

    const createdTeam = await team.save();
    return res.status(201).json(createdTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: DELETE
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
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
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
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = { teamRouter: router };
