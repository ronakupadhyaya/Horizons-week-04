"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

// Passport setup
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

// models setup
var models = require('./models/models');
var User = models.User;


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
	console.log('Connected to MongoDB');
});
mongoose.connect('mongodb://teresaliu20:thirstymango655@ds133192.mlab.com:33192/horizons-passport');

// SESSION SETUP HERE
var MongoStore = require('connect-mongo')(session);
app.use(session({
	secret: 'cookies are yummy',
	store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// HASHING
var crypto = require('crypto');
function hashPassword(password) {
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
	function(username, password, done) {
	    User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			else if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			else if (hashPassword(password) !== user.password) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
	    });
	}
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
	done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if (err) {
			console.log('Error finding the user by id');
		}
		else {
			done(null, user);
		}
	})
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE
app.get('/', function(req, res) {
	if (!req.user) {
		res.redirect('/login');
	}
	res.render('index', {
		user: req.user
	});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.post('/signup', function(req, res) {
	// req.checkbody('username', 'Username cannot be empty').notEmpty();
	// req.checkbody('password', 'Password cannot be empty').notEmpty();

	// var errors = req.validationErrors();

	// if (errors) {
	// 	console.log(errors);
	// }
	// else {
		var newUser = new User({
			username: req.body.username,
			password: hashPassword(req.body.password)
		});
		newUser.save(function(err) {
			if (err) {
				console.log('Error saving to database.');
			}
			else {
				console.log('User successfully saved.');
			}
		});
		res.redirect('/login');
	// }
});

module.exports = app;

