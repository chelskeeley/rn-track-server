require("./models/User");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const secret = require("../secret");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

mongoose.connect(secret.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo instance", err);
});

app.get("/", (req, res) => {
  res.send("Hi There!");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
