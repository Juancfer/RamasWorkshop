const express = require("express");

const { Match } = require("../models/Match.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const matchList = await Match.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Match.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: matchList,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const match = await Match.findById(id);
    if (match) {
      res.json(match);
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
    const match = await Match.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (match?.length) {
      res.json(match);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const match = new Match(req.body);

    const createdMatch = await match.save();
    return res.status(201).json(createdMatch);
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
    const matchDeleted = await Match.findByIdAndDelete(id);
    if (matchDeleted) {
      res.json(matchDeleted);
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
    const matchUpdated = await Match.findByIdAndUpdate(id, req.body, { new: true });
    if (matchUpdated) {
      res.json(matchUpdated);
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

module.exports = { matchRouter: router };