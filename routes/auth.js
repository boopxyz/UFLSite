const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");
const passport = require("passport");

router.get("/discord", ensureAuth, passport.authenticate("discord"));

router.get("/discord/callback", ensureAuth, passport.authenticate("discord"), (req, res) => {
    req.flash("success_flash", "Discord Account Updated");
    res.redirect("/dashboard/settings");
})

module.exports = router;