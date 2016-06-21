// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get('/register', function(req, res, next){
  	res.render('register');
  })
  
  router.post('/register', function(req, res, next) {
  	if (req.body.password !== req.body.repeat) {
  		res.render('register', {
  			error: "Passwords don't match"
  		}).end()
  	}
  	var U = new models.User({
  			user: req.body.username, 
  			password: req.body.password});

	U.save(function(error, user){
		if (error) {
			res.status(400).send("Error creating user: " + error)
		} else {
			res.redirect('/login');
		}
	})
  })

  router.get('/login', function(req, res, next) {
  	res.render('login', {error: req.flash("error")});
  })

  router.post('/login', passport.authenticate('local',  {successRedirect: '/', failureRedirect: '/login', failureFlash: true}));
  
  router.get('/logout', function(req, res, next) {
  	req.logout();
  	res.redirect('/login');
  })


  return router;
};
