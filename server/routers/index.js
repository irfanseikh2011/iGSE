const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const loginRouter = require("./Login");


router.get("/api", (req, res) => {
  res.send("Welcome to Queue Interest");
});

router.use("/login", questionRouter);


module.exports = router;