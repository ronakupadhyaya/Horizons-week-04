"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require("passport");
var passportLocal = require("passport-local");
var passwords = require('./passwords.plain.json')
var LocalStrategy = require('passport-local').Strategy;
var session = require('cookie-session');



// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	keys: ['password'],
	maxAge: 1000 * 60 * 2
	// maxAge: 1000
}));

// MONGODB SETUP HERE

// SESSION SETUP HERE



// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(function(username, password, done) {
	// Find the user with the given username
	// May need to adapt this to your own model!

	var found;
	var user;
	for (var i = 0; i < passwords.passwords.length; i++) {
		if (username === passwords.passwords[i].username) {
			// console.log("FOUND", username, passwords.passwords[i].username);
			console.log(passwords.passwords[i]);
			found = true;
			user = passwords.passwords[i];
		}
	}
	console.log(username, password);
	return done(null, user);
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
	// if (!req.isAuthenticated()) {
	// 	res.redirect('/login');
	// }
	if (!req.user) {
		res.redirect('/login');
	} else if (req.user) {
		res.render('index', {
			user: req.user,
		});
	}
	// res.render('index', {});
});

app.get('/login', function(req, res) {
	res.render('login', {});
});

app.post('/login', passport.authenticate('local', {
	successRedirect: "/",
	failureRedirect: "/login"
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
})

var port = '3000'
app.listen(port);

module.exports = app;