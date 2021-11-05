const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");

router.get("/", ensureAuth, (req, res) => {
    res.render("usersettings", { user: req.user });
});

module.exports = router;