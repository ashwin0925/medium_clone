var User = require("../models/user")

exports.checkUserLogged = (req, res, next) => {
  if(req.session && req.session.userId) {
    next()
  } else {
    req.flash('info', 'You need to login first');
    res.redirect('/users/login')
  }
  }


  exports.loggedUserInfo = (req, res, next) => {
    if(req.session && req.session.userId) {
        var userId = req.session.userId;
        User.findById(userId, "-password", (err, user) => {
            if(err) return next('Invalid userId in session');
            // if user
            // put user into request object
            req.loggedUser = user;
            res.locals.loggedUser = user;
            next();
        })    
    } else {
        req.loggedUser = null;
        res.locals.loggedUser = null;
        next()
    }
}