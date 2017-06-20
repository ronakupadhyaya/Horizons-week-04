"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
 


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Passport setup 
var passport = require('passport');

// Linking the user model 
var models = require('./models/models');
var User = models.User;

// MONGODB SETUP HERE
var mongoose = require('mongoose'); 
mongoose.connection.on('connected', function() {
	console.log('Connected to MongoDb!'); 
}); 
mongoose.connect('mongodb://otto:password@ds113650.mlab.com:13650/week4day1')

// Hashing 
var crypto = require('crypto'); 
function hashPassword(password) {
	var hash = crypto.createHash('sha256'); 
	hash.update(password); 
	return hash.digest('hex'); 
}

// SESSION SETUP HERE
var session = require('express-session'); 
var MongoStore = require('connect-mongo')(session); 
app.use(session({
	secret: 'your secret here', 
	store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// Variable for id 
var id = 7; 

// Enable form validation with express validator.
var expressValidator = require('express-validator');
app.use(expressValidator());

// Defining the array of users 
var passwords = require('./passwords.hashed.json')
console.log(passwords)

// PASSPORT LOCALSTRATEGY HERE
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy (
	function(username, password, done) {
		models.User.findOne({username: username}, function(err, user) {
			if (user.password === password) {
				done(null, user); 
			} else {
				done(null, false); 
			}
		})

		// console.log("unhashed", password);
		// var hashedPassword = hashPassword(password); 
		// console.log("hashed", hashedPassword);
		// var goodUsername = false;
		// var goodPassword = false;  
		// var user2 = {}; 
		// passwords.passwords.forEach(function(user) {
			
		// 	if (user.username === username) {
		// 		 goodUsername = true;
		// 		 user2[username] = username; 
		// 		 user2["_id"] = user["_id"]
		// 	}
		// 	if (user.password === hashedPassword) {
		// 		goodPassword = true; 
		// 		user2[password] = hashedPassword 
		// 	}
		// })
			
		// if (goodUsername === false) {
		// 	return done(null, false, {message: 'Incorrect username'})
		// } 
		// if (goodPassword === false) {
		// 	return done(null, false, {message: "Incorrect password"})
		// }
		// return done(null, user2); 
	})
); 


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
	done(null, user._id); 
	console.log('serializing...')
})

passport.deserializeUser(function(id, done) {
	var user = User.findById('id', function(err, user) {
	}); 
	done(null, user); 
})	

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize()); 
app.use(passport.session()); 

// YOUR ROUTES HERE
app.get('/', function(req, res) {
	console.log('made it here')
	console.log(req.user)
	if(!req.user) {
		res.redirect('/login')
	} else {
		res.render('index', {user: req.user})
	}
	
})

app.get('/login', function(req, res) {
	res.render('login')
})

app.post('/login', passport.authenticate('local',
	{ 
	  successRedirect: '/',
      failureRedirect: '/login' 
  	}) 
); 

app.get('/logout', function(req, res) {
	req.logout(); 
	res.redirect('/'); 
}); 

app.get('/signup', function(req, res) {
	res.render('signup')
})

app.post('/signup', function(req, res) {
	req.checkBody('username', 'Please enter a username').notEmpty();
	req.checkBody('password', 'Please enter a password').notEmpty();
	var errors = req.validationErrors();
  	if (errors) {
  		res.redirect('/signup'); 
  	} else {
  		id++ 
  		var user = new User({username: req.body.username, password: req.body.password, _id: id})
  		user.save(function(err) {
  			if (err) {
  				console.log (err)
  			} else {
  				res.redirect('/login')
  			}
  		})
  	}
})


module.exports = app;
