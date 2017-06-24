var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE

  router.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/contacts')
    } else {
      res.redirect('/login')
    }
  })

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {

    if (req.body.username && req.body.password && validateReq(req.body)) {
      console.log('hi')
      var newUser = new models.User({
        username: req.body.username,
        password: req.body.password
      })

      newUser.save(function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/register');
          return;
        }
        // console.log(user);
        res.redirect('/login');
      });
    }

  })

  router.get('/login', function(req, res) {
    res.render('login')
  })

  router.post('/login', passport.authenticate('local', { successRedirect: '/contacts',
  failureRedirect: '/login' }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // router.get('/contacts')
  return router;
}
