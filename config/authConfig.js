module.exports = {
    ensureAdmin: (req, res, next) => {
      if (req.user.userSpecials[0].permissions == "5" || req.user.userSpecials[0].dev) {
        return next();
      }
      req.redirect("/");
    },
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Unauthorized to View this Page");
        res.redirect("/");
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }
}