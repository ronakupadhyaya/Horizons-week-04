// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  // First, Add a route in auth.js to access this page from /register when a your server receives a GET request. 
  //You should render the views/register.hbs template in the views folder when handling that GET request.
  router.get('/', function(req, res, next){
  	users.find((function(err, users){
  		if(err){
  			res.render('/register')}
  		else{
  			res.render('/login')
  		}
  		}
  	))
  	});
  router.get('/register', function(req, res, next){
  	res.render('register')
  });
  router.get('/login', function(req, res, next){
  	res.render('login')
  });

  router.post('/register', function (req, res, next){
  	if(req.body.password !== req.body.repeatPassword || req.body.password== ""){  //is blank 
  		console.log("errors");
  		res.render('register', {errors: errors});
  	}
  	else{
  		var user = new models.users({
  			username: req.body.username,
  			password: req.body.password
  		})
  		user.save(function(error, user){
  			if(error){
  				console.log("error with errors")
  				res.status(400).send("error creating user"+ error);
  			}else{
  				console.log("not working");
  				res.redirect('/login')
  			}
  		})
  	}
  })

  return router;
};

// Project.find(function(err, projects) {
//     if (err) res.send(err);
//     var flash;
//     if (req.session.flash)
//       flash = req.session.flash.shift();
//     res.render('index', {projects: projects, title: "Horizon Starter", flash: flash});
//   }
