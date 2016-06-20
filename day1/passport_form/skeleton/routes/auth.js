// imports n' things
var router = require('express').Router();


// Questions:
// defining variables
// pulling from master
// creating a new user
module.exports = function(passport) {
  
   router.get('/register', function(req, res, next) {
		res.render('register');
    })

  	router.post('/register', function(req, res, next) {

  		user = req.body.username;
  		password = req.body.password;
  		rePassword = req.body.rePassword;

  		// can also make sure that fields aren't empty

  		// check if password fields are equivalent
  		if (password === rePassword) {
  			// create a new user and save it

  			// redirect to login page
  			res.redirect('login');
  		}
  		else {
  			res.render('register'); // and show error message
  		}
  		
  	})

  	router.get('/login', function(req, res, next) {

  		res.render('login');
  	})

  	router.post('/login', passport.authenticate('local'), function(req, res) {
    ...
	});

  	router.get('/logout', function(req, res, next) {

  		
  	})
  
  
  return router;
};
