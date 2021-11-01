const express = require("express")
const router = express.Router();
const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const uniqid = require('uniqid'); 
const passport = require("passport");
const { forwardAuthenticated } = require("../config/authConfig");

router.get("/", forwardAuthenticated, (req, res) => {
    res.render("index");
});

router.get("/whatisthis", (req, res) => {
    res.render("whatisthis");
});

router.get("/signup", forwardAuthenticated, (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { username: plainUsername, password: plainPassword, email: plainEmail } = req.body;
    let errorA
    console.log("Signup Requested")

    if (!plainUsername || typeof plainUsername !== "string") {
        errorA = "Invalid Username";
        console.log("Signup Error")
        return res.render("signup", { errorA, plainUsername, plainPassword, plainEmail })
    }

    if (!plainPassword || typeof plainPassword !== "string") {
        errorA = "Invalid Password";
        console.log("Signup Error")
        return res.render("signup", { errorA, plainUsername, plainPassword, plainEmail })
    }

    if (plainPassword.length <= 5) {
        errorA = "Password must be 6 or more characters";
        console.log("Signup Error")
        return res.render("signup", { errorA, plainUsername, plainPassword, plainEmail })
    }

    const username = plainUsername.toLowerCase()
    const password = await bcrypt.hash(plainPassword, 10);
    const email = plainEmail;
    const userID = uniqid("ofl-");

    if (userSchema.find({ userEmail: email })) {
        console.log("Signup Error")
        errorA = "Email is already in use";
        return res.render("signup", { errorA, plainUsername, plainPassword, plainEmail })
    }

    const newUser = new userSchema({
        userUsername: username,
        userID: userID,
        userEmail: email,
        userPassword: password
    })

    try {
        const result = await newUser.save();
        console.log("New User Registered: " + result);
        req.flash("success_flash", "Registration Successful")
        res.redirect("/");
    } catch(err) {
        if(err.code === 11000) {
            console.log("Signup Error")
            ererrorAror = "Username is already in use";
            return res.render("signup", { errorA, plainUsername, plainPassword, plainEmail })
        }
        throw error;
    }
})

router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next);
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_flash", "Logged Out Successfully");
    res.redirect("/");
}) 

module.exports = router;