// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');
var bcrypt = require('bcrypt');
const saltRounds = 10;


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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(err) {
        return res.render('signup', {
          error: 'Failed to hash password with bcrypt',
        });
      } else {
        var u = new models.User({
          // Note: Calling the email form field 'username' here is intentional,
          //    passport is expecting a form field specifically named 'username'.
          //    There is a way to change the name it expects, but this is fine.
          email: req.body.username,
          password: hash,
          displayName: req.body.displayName,
        });

        u.save(function(err, user) {
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
            return;
          }
          console.log(user);
          res.redirect('/login');
        }); //end save
      } // end else
    }); // end async hash

  }); // end POST

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
