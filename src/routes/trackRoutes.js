const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

// to access the Track model, we want to use mongoose to access it.
// if we import the file directly, we will be executing the mongoose.model() method multiple times,
// and will get an error regarding creating multiple of the same model

const Track = mongoose.model("Track");

const router = express.Router();

// we want all requests to these routes to ensure the user is first signed in
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  return res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and location." });
  }

  try {
    const track = new Track({ name, locations, userId: req.user._id });

    await track.save();
    res.send(track);
  } catch (e) {
    res.status(422).send({ error: e.message });
  }
});

module.exports = router;
