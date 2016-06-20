// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  
  router.get('/register', function(req,res) {
  	res.render('register');
  })

  router.post('/register', function(req,res,next) {
  	console.log(req.body);
  	console.log(req.body.password);
  	console.log(req.body.confirmPassword);
  	console.log(req.body.password === req.body.confirmPassword)
  	if (req.body.password === req.body.confirmPassword) {
  		//this is coming from the register.hbs page
  		var newUser = new models.user({
  			username: req.body.username,
  			password: req.body.password
  		});
  		newUser.save(function(error, mongoUser) {
  			console.log(error)
  			if (error) {
  				res.send("<h1>Error!</h1>");
  			} else {
  				res.redirect('/login');
  			}
  		})
  	} else { res.send("<h1>Passwords don't match.</h1>")}
   })

  router.get('/login', function(req,res){
  	res.render('login');
  })

  router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
  });
  
  router.get('/logout', function(req,res){
  	req.logout();
  	res.redirect('/login');
  })

  return router;
};
