const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");
const userSchema = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/", ensureAuth, (req, res) => {
    res.render("dashhome", { user: req.user });
});

module.exports = router;