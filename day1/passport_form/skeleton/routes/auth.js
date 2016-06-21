// imports n' things
var router = require('express').Router()
var express = require('express')
var models = require('../models/models')


module.exports = function(passport) {
 
router.get('/register', function(req, res){
		res.render('register')
}) 
  
 var validatePassword = function(data){
 	return (data.password === data.repeatPassword)
 }


router.post('/register', function(req, res) {
  if (!validatePassword(req)) {
      res.render('register', {
        error: "Passwords must be the same"
      });
    };

  var newUser = new models.User({
  	username: req.body.username,
  	password: req.body.password
  });
  
  newUser.save(function(err, user) {
  	if(err) {
  	console.log(err)
  	res.status(500).redirect('/register')
  	return
  	}
  	console.log(user)
  	res.redirect('/login')
  	});
})

router.get('/login', function(req, res) {
	res.render('login')
})

router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/')
});

router.get('/logout', function(req, res){
	 req.logout();
	 res.redirect('/login')
})
  
  return router;
};
