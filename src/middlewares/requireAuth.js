const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const secret = require("../../secret");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === "Bearer kajsdfkjsadfkjh"

  if (!authorization) {
    return res.status(403).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, secret.jwtKey, async (err, payload) => {
    // payload represents what we stored in the jwt on creation
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;

    const user = await User.findById(userId);

    req.user = user;

    next();
  });
};
