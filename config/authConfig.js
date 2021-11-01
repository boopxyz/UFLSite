module.exports = {
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