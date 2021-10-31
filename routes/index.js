const express = require("express")
const router = express.Router();
const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const uniqid = require('uniqid'); 

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/whatisthis", (req, res) => {
    res.render("whatisthis");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { username: plainUsername, password: plainPassword, email: plainEmail } = req.body;
    let error
    console.log("Signup Requested")

    if (!plainUsername || typeof plainUsername !== "string") {
        error = "Invalid Username";
        console.log("Signup Error")
        return res.render("signup", { error, plainUsername, plainPassword, plainEmail })
    }

    if (!plainPassword || typeof plainPassword !== "string") {
        error = "Invalid Password";
        console.log("Signup Error")
        return res.render("signup", { error, plainUsername, plainPassword, plainEmail })
    }

    if (plainPassword.length <= 5) {
        error = "Password must be 6 or more characters";
        console.log("Signup Error")
        return res.render("signup", { error, plainUsername, plainPassword, plainEmail })
    }

    const username = plainUsername.toLowerCase()
    const password = await bcrypt.hash(plainPassword, 10);
    const email = plainEmail;
    const userID = uniqid("ofl-");

    if (userSchema.find({ userEmail: email })) {
        console.log("Signup Error")
        error = "Email is already in use";
        return res.render("signup", { error, plainUsername, plainPassword, plainEmail })
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
            error = "Username is already in use";
            return res.render("signup", { error, plainUsername, plainPassword, plainEmail })
        }
        throw error;
    }
})

module.exports = router;