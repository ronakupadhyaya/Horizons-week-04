// imports n' things
var router = require('express').Router();
var User=require('../models/models');
// var strftime = require('strftime');

module.exports = function(passport) {
  // YOUR CODE HERE
 router.get('/register', function(req,res){
  	res.render('../views/register')
  })

 router.post('/register',function(req,res){
 	console.log('x')
 	if(req.body.password!==req.body.password2){
 		//NEED TO FIX THIS PART
 		var error="Passwords must match";
 		res.render('register')
 		return
 	}
 	var user=new User({
 		username: req.body.username,
 		password: req.body.password
 	});
 	user.save(function(err, user){
 		
 		if (err) {
 			console.log(err)
 			return;
 		}

	 	res.redirect('/login');
 	});
 })
 router.get('/login', function(req,res){
 	res.render('login')
 })

 router.post('/login', passport.authenticate('local'), function(req,res){
 	res.redirect('/')
 });

 router.get('/logout', function(req,res){
 	req.logout();
 	res.redirect('/login'
 })

  return router;
};
