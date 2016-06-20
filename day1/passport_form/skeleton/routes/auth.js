// imports n' things
var router = require('express').Router();
var models = require("../models/models");

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get("/register", function(req, res, next) {
  	res.render('register');
  });

  
  router.post("/register", function(req, res) {


  	if(req.body.username.length <1 || req.body.password != req.body.repeatPassword) {
  		console.log("ERRORS WITH VALIDATION");
  	} else {
  		//test password validation
  		var newUser = new models.User ({
  		username: req.body.username,
  		password: req.body.password
  	});
	  	newUser.save(function(error, User) {
	  		if(error) {
	  			res.status(400).send("Error creating new user");
	  		} else {
	  			console.log("Username: " + req.body.username);
	  			res.redirect('/login');
	  		}
	  	})
  	}
  });

  router.get("/login", function(req, res) {
  	res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
  	successRedirect: '/',
  	failureRedirect: '/login'
  }));

  // router.post('/login', function(req, res) {
  // 	var username = req.body.username;

  // 	models.User.findOne({username: req.body.username}, function(error, user) {
  // 		if(error) {
  // 			console.log("Error" + error);
  // 		} else {
  // 			if(user.password != req.body.password) {
  // 				console.log("Password is incorrect");
  // 				res.redirect('/login');
  // 			} else {
  // 				console.log("you have successfully logged in");
  // 				res.redirect('/');
  // 			}
  // 		}
  // 	})
  // });

  router.get('/logout', function(req, res) {
  	req.logout();
  	res.redirect('/login');
  });

  return router;
};


