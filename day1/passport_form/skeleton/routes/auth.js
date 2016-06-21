var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  router.get('/register', function(req, res, next) {
    res.render('register');
  });

  router.post('/register', function(req, res, next) {
    if (!req.body.password == req.body.passwordRepeat) {
      res.render('/register', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  router.get('/login', function(req, res, next) {
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

  return router;
};
