const express = require("express")
const router = express.Router();
const { ensureAuth } = require("../config/authConfig");
const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/:id", ensureAuth, async (req, res) => {
    try {
        const id = req.params.id.substring(1);
        const foundUser = await userSchema.findOne({ userID: id });
        if (!foundUser) {
            // req.flash here to display error code
            return res.redirect("/404");
        }
        res.render("profile", { user: req.user, pUser: foundUser });
    } catch(err) {
        // req.flash here to display error code
        return res.redirect("/500");
    }
});

router.post("/update/username", ensureAuth, async (req, res) => {
    const { username, password } = req.body;
    const newUsername = username.toLowerCase();
    

    const result = await bcrypt.compare(password.toString(), req.user.userPassword);

    if (result) {
        const currentUser = await userSchema.findOneAndUpdate({ userEmail: req.user.userEmail }, {
            userUsername: newUsername
        }).catch(err => {
            req.flash("error", "An Unexpected Error has Occured");
            return res.redirect("/dashboard/settings");
        });

        req.flash("success_flash", "Username Successfully Changed to " + newUsername);
        return res.redirect("/dashboard/settings");
    } else {
        req.flash("error", "Invalid Password Provided");
        return res.redirect("/dashboard/settings");
    }
})

module.exports = router;