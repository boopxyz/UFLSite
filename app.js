// Require Modules

require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require('connect-flash');
const session = require('express-session');

// Init Express

const app = express();

// Passport Config

require("./config/passportConfig")(passport);

// Connect to Database

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Successfully Connected to the Database");
}).catch(err => {
    console.log("Could Not Connect to the Database: " + err);
});

// Express Middleware

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(session({
    secret: "oflmsLogin",
    resave: true,
    saveUninitialized: true,
    maxAge: 14 * 24 * 3600000
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_flash = req.flash("success_flash");
    res.locals.error = req.flash("error");
    next();
})

// Setup Routes

app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));

// Error Router


// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Activated. Listening on Port " + port);
})