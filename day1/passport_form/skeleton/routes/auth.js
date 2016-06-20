// imports n' things
var router = require('express').Router();
var User = require('../models/models');

// Questions:
// defining variables
// pulling from master
// creating a new user

// save user
// what to put in post('/login')
// why doesn't register page show
// what to do with mongo password

// when register button is pressed, nothing happens
module.exports = function(passport) {
  
   router.get('/register', function(req, res, next) {
		res.render('register');
    });

  	router.post('/register', function(req, res, next) {

  		var username = req.body.username;
  		var password = req.body.password;
  		var rePassword = req.body.rePassword;

  		// can also make sure that fields aren't empty

  		// check if password fields are equivalent, then allow user to register and redirect to login page
  		if (password === rePassword) {
  			// create a new user and save it
  			user = new User ({
  				username: username,
  				password: password
  			});

  			user.save(function(err) {
  				if (err) {
  					console.log('error registering');
  				}
  				else {
  					res.redirect('login');
  				}
  			});	
  		  }

  		  else {
  			res.render('register'); // and show error message
  		  }
  	});

  	router.get('/login', function(req, res, next) {
  		res.render('login');
  	});

  	router.post('/login', passport.authenticate('local'), function(req, res) {
  		res.redirect('/');
	});

  	router.get('/logout', function(req, res, next) {
  		req.logout();
  		res.redirect('/');
  	});
  
  
  return router;
};
