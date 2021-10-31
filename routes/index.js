const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/whatisthis", (req, res) => {
    res.render("whatisthis");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

module.exports = router;