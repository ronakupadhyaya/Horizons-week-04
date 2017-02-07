"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require("passport");
var passportLocal = require("passport-local");
var passwords = require('./passwords.hashed.json')
var LocalStrategy = require('passport-local').Strategy;
// var session = require('cookie-session');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var crypto = require('crypto');

mongoose.connection.on('connected', function() {
	console.log("connected to mongodb");
});



mongoose.connect("mongodb://db-user:8g(T0+w!d6qD=/bLtI@ds139969.mlab.com:39969/snuupy-horizons");

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
// app.use(session({
// 	keys: ['password'],
// 	maxAge: 1000 * 60 * 2
// 	// maxAge: 1000
// }));

app.use(session({
	secret: 'secret',
	store: new MongoStore({
		mongooseConnection: require('mongoose').connection
	})
}));

// MONGODB SETUP HERE

// SESSION SETUP HERE



// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(function(username, password, done) {
	// Find the user with the given username
	// May need to adapt this to your own model!
	var hashedPassword = hashPassword(password);
	console.log("hash", hashedPassword);
	var found;
	var user;
	for (var i = 0; i < passwords.passwords.length; i++) {
		if (username === passwords.passwords[i].username) {
			found = true;
			user = passwords.passwords[i];
		}
	}

	if (found && (hashedPassword === user.password)) {
		console.log("logging in");
		return done(null, user);
	}

	console.log("nope");
	return done(null, false);

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

function hashPassword(password) {
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

var port = '3000'
app.listen(port);

module.exports = app;