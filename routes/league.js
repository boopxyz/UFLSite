const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");

router.get("/", ensureAuth, (req, res) => {
    res.render("leaguehomepage", { user: req.user });
});

router.get("/manage", ensureAuth, (req, res) => {
    res.render("manageleague", { user: req.user });
});

module.exports = router;