// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');


module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      // Note: Calling the email form field 'username' here is intentional,
      //    passport is expecting a form field specifically named 'username'.
      //    There is a way to change the name it expects, but this is fine.
      email: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
      location: ""
    });

    u.save(function(err, user) {
      console.log('attempting to save user')
      if (err) {
        console.log(err);
        res.status(500).redirect('/signup');
        return;
      }
      console.log(user);
      console.log('redirecting to /login')
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    console.log('redirected to /login')
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log('login succesful')
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
