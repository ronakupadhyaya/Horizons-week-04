// imports n' things
var router = require('express').Router();
var mongoose = require('mongoose');
var models = require('../models/models')

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get('/register', function(req, res, next) {
  	res.render('register');
  })


  router.post('/register', function(req, res, next) {
  	if (req.body.password !== req.body.repeatpw) {
  		res.send("passwords don't match");
  	}
  	if (req.body.password.length === 0) {
  		res.send("invalid password");
  	}
  	var u = new models.users({
  		username: req.body.username,
  		password: req.body.password
  	});
  	u.save(function(error, user) {
  		if (error) {
  			res.status(400).send("error creating user: " + error)
  		} else {
  			res.redirect('/login');
  		}
  	})
  })

  router.get('/login', function(req, res, next) {
  	res.render('login');
  })

  router.post('/login', passport.authenticate('local'), function(req, res) {
  	res.redirect('/')
  })

  router.get('/logout', function (req, res, next) {
  	req.logout();
  	res.redirect('/login');
  })
  
  
  return router;
};
