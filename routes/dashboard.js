const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");

router.get("/", ensureAuth, (req, res) => {
    res.render("dashhome", { user: req.user });
});

router.get("/your-player-profile", ensureAuth, (req, res) => {
    res.render("playerprofile", { user: req.user });
});

module.exports = router;