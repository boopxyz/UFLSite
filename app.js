// Require Modules

require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

// Init Express

const app = express();

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

// Setup Routes

app.use("/", require("./routes/index"));

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Activated. Listening on Port " + port);
})