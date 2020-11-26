const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const secret = require("../../secret");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, secret.jwtKey);
    res.send({ token });
  } catch (e) {
    return res.status(422).send(e.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "Email not found." });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, secret.jwtKey);
    res.send({ token });
  } catch (err) {
    return res.status(404).send({ error: "Invalid email or password." });
  }
});

module.exports = router;
