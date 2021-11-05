const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userUsername: {type: String, required: true, trim: true},
    userID: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    userCreationDate: { type: Date, required: false, default: Date.now},
    userBadges: {type: Array, required: false, default: [{}]},
    userSpecials: {type: Array, required: false, default: [{
        dev: false,
        permissions: "0"
    }]},
    userInformation: {type: Array, required: false, default: [{
        userTitle: "Player",
    }]},
    linkedAccounts: {type: Array, required: false, default: [{}]}
});

module.exports = mongoose.model("User", userSchema, "users");