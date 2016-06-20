// imports n' things
var router = require('express').Router();
var models = require('../models/models');


module.exports = function(passport) {

	router.get('/register', function(req, res, next){
			res.render('register');
		});

	router.post('/register', function(req, res, next){
		var pass1 = req.body.password;
		var pass2 = req.body.password2;
		if (pass1 === pass2){
			var newUser = new models.Users(
			{
				username: req.body.username,
				password: req.body.password
			});

			newUser.save(function(err, success){
			if (err) {
				console.log(err);
			}
			else {
				console.log(success);
				res.redirect('/login');
			}
		})
		}
	});

	router.get('/login', function(req, res, next){
		res.render('login');
	});

	router.post('/login', passport.authenticate('local'), function(req, res){
		res.redirect('/');
	});

	router.get('/logout', function(req, res, next){
		req.logout();
	});

  return router;
};
