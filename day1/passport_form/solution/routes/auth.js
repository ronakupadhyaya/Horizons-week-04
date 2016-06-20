var express = require('express');
var router = express.Router();
var passport = require('passport');
var models = require('../models/models');

// GET registration page
router.get('/register', function(req, res) {
  res.render('register');
});

// POST registration page
var validateReq = function(userData) {
  return (userData.password === userData.passwordRepeat);
};

router.post('/register', function(req, res) {
  // validation step
  if (!validateReq(req)) {
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

// GET Login page
router.get('/login', function(req, res) {
  res.render('login');
});


// POST Login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  session: false
}));

// GET Logout page
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
