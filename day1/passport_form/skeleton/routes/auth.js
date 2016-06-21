// imports n' things
var router = require('express').Router();
var validator = require('express-validator');
var User = require('../models/models.js');
var models = require("../models/models.js", function(req, res) {

  });


module.exports = function(passport) {
  // YOUR CODE HERE
  router.get('/register', function (req, res, next) {
  	res.render('register');
  });

  // Write a function that takes a request object and does
// validation on it using express-validator.
function validate(req) {
  req.checkBody('username', 'Invalid username').notEmpty();
  req.checkBody('password', 'Invalid password').notEmpty();
  req.checkBody('repeatPassword', 'Invalid password').notEmpty().equals(req.body.password);
}
  
  router.post('/register', function (req, res, next) {
  validate(req);
  // Get errors from express-validator
  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {errors: errors});
  } else {
    var newUser = new User({username: req.body.username, password: req.body.password});
    newUser.save(function(error) {
    	if (error) {
    		console.log(error);
    	}
    });
    res.redirect('/login');

  
	};

    
  });

  router.get('/login', function (req, res, next) {
  	res.render('login')
  })

  router.post('/login', passport.authenticate('local'), function (req, res, next) {
  	res.redirect('/login');
  })

  router.get('/logout', function (req, res, next) {
  	req.logout();
  	res.redirect('/login');
  })
  
  	


  
  return router;
};
