// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
router.get('/register', function(req, res, next){
	res.render('register');
})   
  
 router.post('/register', function(req, res, next){
	 var user = new models.User({
		 user: req.body.username,
		 password: req.body.password
	 })
	 
	 user.save(function(error, user){
		 if(error){
			 res.status(400);
		 } else {
			 res.redirect('/login');
		 }
	 });
 })
 
 router.get('/login', function(req, res, next){
	 res.render('login');
 })
 router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/'); 
 });
	
router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/login');
})
  return router;
};
