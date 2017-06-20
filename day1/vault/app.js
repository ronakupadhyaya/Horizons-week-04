"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE

var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
	console.log('Connected to MongoDB!')
})
mongoose.connect('mongodb://hennessey333:mykonos4@ds115411.mlab.com:15411/horizons-week4-day1')

// SESSION SETUP HERE

var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
	secret: 'your secret here',
	store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.hashed.json');
var userPasswords = users.passwords;
var User = require('./models/models').User;

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({username: username, password: password}, function(err, user) {
			if (user) {
				done(null, user);
			}
			else {
				done(null, false);
			}
		})
	}
))


// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		var hashedPassword = hashPassword(password);
// 		for(var i = 0; i < userPasswords.length; i++){
// 			if (username === userPasswords[i].username && hashedPassword === userPasswords[i].password) {
// 				return done(null, userPasswords[i]);
// 			}
// 		}
// 		done(null, false);
// 	}
// ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		if (err) {
			done(null, false);
		}
		else {
			done(null, user);
		}
	})
})


// passport.deserializeUser(function(id, done){
//   var valid = false;
//   userPasswords.forEach(function(user, index){
//     if(id === user._id){
//       done(null, user);
//       valid = true;
//     }
//   })
//   if (!valid) {
//     done(null, false);
//   }
// })

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());

var crypto = require('crypto');
function hashPassword(password){
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    res.render('index', {
      user: req.user
    });
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/signup', function(req, res){
	res.render('signup');
})

app.post('/signup', function(req, res){
	var u = new models.User({
		username: req.body.username,
		hashPassword: hashPassword(req.body.password)
	});
	u.save(function(err){
		if (err) {
			res.redirect('/signup');
		}
		else {
			res.redirect('/login');
			}
		})
});

// app.post('/signup', function(req, res){
// 	if(req.body.username && req.body.password){
// 		var newUser = new User({
// 			username: req.body.username,
// 			password: req.body.password
// 		});
// 		newUser.save(function(err){
// 			if (err) {
// 				res.redirect('/signup');
// 			}
// 			else {
// 				res.redirect('/login');
// 			}
// 		})
// 	}
// 	else {
// 		res.redirect('/signup');
// 	}
// })


module.exports = app;