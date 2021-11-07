const express = require("express");
const router = express.Router();
const { ensureAuth, ensureAdmin } = require("../config/authConfig");
const userSchema = require("../models/User");

router.get("/", ensureAuth, ensureAdmin, (req, res) => {
  res.render("developerpanel", { user: req.user });
});

router.get("/users", ensureAuth, ensureAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  //console.log(`${page} - ${limit}`);

  const allUsers = await userSchema.paginate(
    {},
    {
      page: page,
      limit: limit,
    }
  );

  //console.log(allUsers);
  res.render("developermanageusers", { user: req.user, users: allUsers });
});

router.get("/users/manage/:id", ensureAuth, async (req, res) => {
  try {
    const id = req.params.id.substring(1);
    const foundUser = await userSchema.findOne({ userID: id });
    if (!foundUser) {
      // req.flash here to display error code
      return res.redirect("/404");
    }
    res.render("developermanageuser", { user: req.user, pUser: foundUser });
  } catch (err) {
    // req.flash here to display error code
    return res.redirect("/500");
  }
});

module.exports = router;
