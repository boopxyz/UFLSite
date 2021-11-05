const express = require("express")
const router = express.Router();
const { ensureAuth, ensureAdmin } = require("../config/authConfig");

router.get("/", ensureAuth, ensureAdmin, (req, res) => {
    res.render("developerpanel", { user: req.user });
});

router.get("/manage-users", ensureAuth, ensureAdmin, (req, res) => {
    res.render("developermanageusers", { user: req.user });
});

module.exports = router;