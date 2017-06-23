var express = require('express');
var router = express.Router();

var models = require('../models/models');
var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  router.get('/', function(req, res) {
    if (req.body.username && req.body.password) {
      res.redirect('/contacts');
    } else {
      res.redirect('/login');
    }
  })

  router.get('/signup', function(req,res) {
    res.render('signup');
  })

  function validate(data) {
    if (!data.username) {
      console.log("No username");
      return false;
    } else if (!data.password) {
      console.log("No password")
      return false;
    } else if (data.password !== data.passwordRepeat) {
      console.log("Passwords do not match")
    } else {
      return true;
    }
  }

  router.post('/signup', function(req, res) {
    if (validate(req.body)) {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(function() {
        res.redirect('/login')
      })
    } else {
      res.render('signup', {error: "Please fill out fields correctly"})
    }
  })

  router.get('/login', function(req, res) {
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login'
  }))

  router.get('/logout', function(req,res) {
    req.logout();
    res.redirect('/login');
  })
  return router;
}
