const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = require("../models/User");
const discordStrat = require("passport-discord");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            userSchema.findOne({ userEmail: email}).then(user => {
                if (!user) {
                    return done(null, false, { type: "error", message: "Invalid Email Provided" });
                }

                bcrypt.compare(password, user.userPassword, (err, isMatch) => {
                    if (err) {
                        return console.log(err);
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { type: "error", message: "Invalid Password Provided" })
                    }
                });
            }).catch(err => {return console.log(err)})
        })
    );

    passport.use(
        new discordStrat({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ["email", "identify"],
            passReqToCallback: true
        }, async (req, accessToken, refreshToken, profile, done) => {
            try {
                const { id, username, discriminator, avatar, email } = profile;
            
                const overwrite = await userSchema.findOne({ userEmail: { $ne: req.user.userEmail }, linkedAccounts: [{ discord: [{ discordID: id }] }] });
    
                if (overwrite) {
                    return done("Discord Account Already Linked to Another Account", overwrite);
                }
    
                const userExist = await userSchema.findOneAndUpdate({ userEmail: req.user.userEmail, "linkedAccounts.discord.discordID": id }, {
                    linkedAccounts: [{
                        discord: [{
                            discordID: id,
                            discordUsername: username,
                            discordDiscriminator: discriminator,
                            discordAvatar: avatar,
                            discordEmail: email
                        }]
                    }]
                }, { new: true });
    
                if (userExist) {
                    return done(null, userExist);
                } else {
                    const currentUser = await userSchema.findOneAndUpdate({ userEmail: req.user.userEmail }, {
                        linkedAccounts: [{
                            discord: [{
                                discordID: id,
                                discordUsername: username,
                                discordDiscriminator: discriminator,
                                discordAvatar: avatar,
                                discordEmail: email
                            }]
                        }]
                    })
    
                    return done(null, currentUser);
                }
            } catch(err) {
                console.log(err);
                return done("An Unexpected Error has Occured", null);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        try {
            userSchema.findById(id, (err, user) => {
                done(err, user);
            })
        } catch(err) {
            done("An Unexpected Error has Occured", null);
        }
    })
}