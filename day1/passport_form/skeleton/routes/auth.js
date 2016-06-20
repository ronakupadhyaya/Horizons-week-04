// imports n' things
var router = require('express').Router();
var models = require("../models/models")

module.exports = function(passport) {
	router.get('/register', function(req, res, next){
		res.render('register')
	})
	router.post('/register', function(req, res, next){
		if(req.body.password === req.body.repeatpassword){
			var newUser =  new models.Users({
				username:req.body.username, 
				password:req.body.password})
			newUser.save(function(err, project){
				if (err){
					res.status(400).send("Error: Passwords not the same" + error);
				}else{
					res.redirect('/login')
				}
			})
		}
	})
	router.get('/login', function(req, res, next){
		res.render('login')
	})
  // router.post('/login', function(req,res, next){
  	router.post('/login', passport.authenticate('local'), function(req, res) {
  		res.redirect('/');
  	})
  router.get('/login', function(req,res,next){
  	req.logout();
  	res.redirect('/login')
  })


  return router;
};


