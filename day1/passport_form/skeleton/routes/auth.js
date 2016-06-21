// imports n' things
var router = require('express').Router();
var models = require('../models/models')

module.exports = function(passport) {
  // YOUR CODE HERE
 
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  if(req.body.password === req.body.repassword)
  {
  	if(req.body.username)
  	{
  		var newUser = new models.User({username: req.body.username, password: req.body.password});
  		newUser.save();
  		res.redirect('/login');
  	}
  		else
  		{
  			res.render('register', {error: "Do not have a username."});
  		}
  }
  	else
  	{
  		res.render('register', {error: "Passwords do not match"});
  	}
});

router.get('/login', function(req, res, next) {
	if (req.query.error) {
		res.render('login', {error: req.query.error});
	}
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login?error=Unauthorized'
}), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login');
});
  
  return router;
};
