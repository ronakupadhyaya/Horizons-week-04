// imports n' things
var express = require('express');
var router = require('express').Router();
var validator = require('express-validator');
var User = require('../model/models');

router.get('/register', function(req, res) {
	res.render('register');
});

router.post('/register', function(req, res) {
	req.checkBody('username', 'Username is required').notEmpty();
	var pass = req.body.password;
	var passCheck = req.body.password2;
	var errors = req.validationErrors();
	if (pass !== pass2) {
		errors.push('Error: passwords do not match');
	}
	if (errors) {
		res.render('register', {
			data: req.body;
			flash: { type: 'alert-danger', messages: errors}
		});

	} else {
		var user new User ({
			username: req.body.username;
			password: req.body.password;
		});
		user.save(function(err) {
			if (err) {
				res.render('register', {
					data: req.body;
					flash: { type: 'alert-danger', messages: errors}
				});
			}
			else {
				res.redirect('/login');
			}
		});
	}
})

module.exports = function(passport) {
  // YOUR CODE HERE
  
  
  
  return router;
};
