// imports n' things
var router = require('express').Router()
var User = require('../models/models') 
var mongoose = require('mongoose')
connection = require('../models/connect')
mongoose.connect(connection)
var expressValidator = require('express-validator');
router.use(expressValidator());

module.exports = function(passport) {
// YOUR CODE HERE
	router.get('/login', function(req,res,next) {
		res.render('login')
	})
	
	router.post('/login', function(req,res,next) {
		console.log('!!!!!!!!!!!!!!!!!!!')
		User.find({name: req.body.user}, function(error, cats) {
			if (error) {
				console.log('Error', error);
				res.redirect('/')
			} else {
				console.log('Cats', cats);
				res.redirect('/profile',{name:req.body.user})
			}
		});
	})

	router.get('/register', function(req,res,next) {
		res.render('register')
	})

	function validate(req) {
	  req.checkBody('username', 'Invalid firstName').notEmpty();
	  req.checkBody('password', 'Invalid password').notEmpty();
	  req.checkBody('passwordrepeat', 'Passwords do not match').equals(req.body.password)

	}
	router.post('/register', function(req, res){
	  console.log(req.body);
	  validate(req);
	  var errors = req.validationErrors();
	  if (errors) {
	    console.log(errors);
	    res.render('register', {errors: errors});
	  } else {
	    var user = new User({user:req.body.username, pass:req.body.password})
			console.log(user)
			user.save(function(error) {
				if (error) {
					console.log('Error', error)
				} else {
					console.log('meow')
				}
			})
			res.render('login')
	  }
	});
	

	return router;

};
