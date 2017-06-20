"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');

var User = require('./models/models.js').User;
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function(){
	console.log('Connected to MongoDb!')
})
mongoose.connect('mongodb://sarkarpm:Smiliepants101@ds131742.mlab.com:31742/vault-priya')

// SESSION SETUP HERE
var session = require('cookie-session');
app.use(session({
	keys: ["pretty little liars"],
	maxAge: 1000*60*2
}))

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
	secret: 'pretty little liars',
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));

var crypto = require('crypto');
function hashPassword(password){
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex')
}

// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = require('passport-local').Strategy;
var filePasswords = require('./passwords.hashed.json');

passport.use(new LocalStrategy(
  function(username, password, done) {
  	var hashedPassword = hashPassword(password);
  	User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.hashedPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  	// filePasswords.passwords.forEach(function(user){
  	// 	if(user.username === username && user.password === hashedPassword){
  	// 		return done(null, user)
  	// 	}
  	// 	if(user.username !== username && user.password === hashedPassword){
  	// 		return done(null, false, { message: 'Incorrect password.' });
  	// 	}
  	// 	if(user.username === username && user.password !== hashedPassword){
  	// 		return done(null, false, { message: 'Incorrect username.' });
  	// 	}
  	// })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
// 	filePasswords.passwords.forEach(function(user){
//   		if(user._id === id){
//   			done(null, user)
//   		}
//   	})
// });

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE

app.get('/', function(req, res){
	console.log(req.user)
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

app.post('/login', 
  passport.authenticate('local', { 
  	successRedirect: '/',
  	failureRedirect: '/login' 
  }));

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
})

app.get('/signup', function(req,res){
	res.render('signup')
})

app.post('/signup', function(req,res){
	if(req.body.username && req.body.password){
		var newUser = new User({
			username: req.body.username,
			hashedPassword: hashPassword(req.body.password)
		})
		newUser.save(function(err){
			if(err){
				throw new Error('could not save user');
			}
			else{
				res.redirect('/login')
			}
		})
	}
	
})

module.exports = app;
app.listen(3000)
