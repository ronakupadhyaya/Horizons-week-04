// imports n' things
var router = require('express').Router();
var models = require('../models/models');
models.User.find(function(err, users) {
	console.log('here is err and users');
	console.log(err);
	console.log(users);
})
module.exports = function(passport) {
  // YOUR CODE HERE
  
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
    console.log('help');
    if (!validateReq(req)) {
      res.render('/register', {
        error: "Passwords don't match."
      });
      return;
    }
    console.log('help2');
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });
    console.log("3");
    console.log(u);
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
