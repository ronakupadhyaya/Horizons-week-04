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

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
	console.log('Connected to Mongob!');
});
mongoose.connect(process.env.MONGODB_URI);
var User = require('./models/models.js');

// hashing

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
	secret: 'magical cookies',
	store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());




// PASSPORT LOCALSTRATEGY HERE

var users = require('./passwords.hashed.json');
console.log('users ', users);

passport.use(new Strategy(function(username, password, done){
	console.log('user: ', username);
	console.log('password: ', password);
	// var user = {};
	// var found = false;
	// if(username && password){
	// 	for(var i = 0; i < users.passwords.length; i++){
	// 		if(users.passwords[i]["username"] === username && users.passwords[i]["password"] === hashPassword(password)){
	// 			found = true;
	// 			console.log('username: ', users.passwords[i]["username"]);
	// 			console.log('password: ', users.passwords[i]["password"]);
	// 			user = users.passwords[i];
	// 			console.log('user ', user);
	// 		}
	// 	}
	// 	if(!found){
	// 		console.log('Did not work bud.');
	// 		done(null, false, {message: 'Invalid credentials.'});
	// 	}  else{
	// 		console.log('it works.');
	// 		done(null, user);
	// 	}
	// }  else{
	// 	console.log('invalid entries.');
	// 	done(null, false, {message: 'Invalid entries.'});
	// }


	User.findOne({username: username}, function(err, user){
		if(err || !user){
			console.log('no user found.');
			done(null, false);
		}  else if(hashPassword(password) === user.password){
			console.log('user found.');
				done(null, user);
		}  else{
			console.log('wrong password');
		}

});
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
		done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
//   console.log('in deserialize');
// });


passport.deserializeUser(function(id, done) {
	console.log('in deserialize.');
	// var found = false;
	// var retUser = {};
	//
	//
	// users.passwords.forEach(function(user){
	// 	if(user._id === id){
	// 		found = true;
	// 		retUser = user;
	// 	}
	// });
	//
	// if(!found){
	// 	console.log('user with corresponding id not found.');
	// 	done(null, false);
	// }  else{
	// 	console.log('user with correspondign id was found.');
	// 	done(null, retUser);
	// }


	User.findById(id, function(err, user){
		console.log('Err ', err);
		if(err){
			console.log('Err inside ', err);
		}  else{
			done(null, user);
		}
	});
});


// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

module.exports = app;

app.get('/', function(req, res){
	console.log('user ', req.user);
	if(!req.user){
		res.redirect('/login');
	}  else{
		res.render('index', {
			user: req.user
		});
	}
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/signup', function(req, res){
	res.render('signup');
});

app.post('/signup', function(req, res){
	if(req.body.username && req.body.password){
		var newUser = new User({
			username: req.body.username,
			password: hashPassword(req.body.password)
		});

		newUser.save(function(err){
			if(err){
				res.send(err);
			}  else{
				console.log('saved');
				res.redirect('/login');
			}
		})
	}
});
