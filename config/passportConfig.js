const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = require("../models/User");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            userSchema.findOne({ userEmail: email}).then(user => {
                if (!user) {
                    return done(null, false, { message: "Invalid Email Provided" });
                }

                bcrypt.compare(password, user.userPassword, (err, isMatch) => {
                    if (err) {
                        return console.log(err);
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Invalid Password Provided" })
                    }
                });
            }).catch(err => {return console.log(err)})
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        userSchema.findById(id, (err, user) => {
            done(err, user);
        })
    })

}