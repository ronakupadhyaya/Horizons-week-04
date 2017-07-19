// imports n' things
var router = require('express').Router();
var models = require('../models/models');
var User = models.User;

module.exports = function(passport) {


  router.get("/login", function(req, res) {
    res.render("login");
  });

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });


  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
  });






  // router.post("/login", function(req, res) {
  //   User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
  //     if (err) {
  //       res.status(500);
  //     } else if (!user) {
  //       res.render("login", {error: true});
  //     } else {
  //       res.redirect("/");
  //     }
  //   });
  // });



  router.get("/register", function(req, res) {
    res.render("register");
  });

  router.post("/register", function(req, res) {
    if (!req.body.password || ! req.body.passwordRepeat || !req.body.username || req.body.password != req.body.passwordRepeat) {
      res.render("register", {error: true});
    } else {
      new User({
        username: req.body.username,
        password: req.body.password
      }).save(function(err) {
        if (err) {
          res.status(500).send("error saving user to database");
        } else {
          res.redirect("/login");
        }
      });
    }
  });



  return router;
};
