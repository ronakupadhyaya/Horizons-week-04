"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.plain.json');
var hashedDB = require('./passwords.hashed.json')
// var session = require('cookie-session');
var session = require('express-session')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var validator = require('express-validator');
var User = require('./models/models.js');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
	console.log('Connected to MongoDB!');
});

mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(session({
// 	keys: ['breakfree'],
// 	maxAge: 1000*10
// }));
app.use(session({
	secret: 'BreakFree',
	store: new MongoStore({mongooseConnection: require('mongoose').connection}) 
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.findOne({Username: username}, function(err, user) {
  		if (err) {
  			done(err, null);
  		} else {
  			if (!user) {
  				done(null, false);
  			} else {
				var hashedPassword = hashPassword(password);
  				if (hashedPassword === user.Password) {
  					done(null, user);
  				} else {
  					done(null, false);
  				}
  			}
  		}
  	})
  }))

 //  	var hashedPassword = hashPassword(password);
 //  	for (var i = 0; i < hashedDB.passwords.length; i++) {
 //  		if (hashedDB.passwords[i]['username'] === username && hashedDB.passwords[i]['password'] === hashedPassword) {
 //  			return done(null, hashedDB.passwords[i])
 //  		}
 //  	}
	// done(null, false) 	
 //  	}
 // ))

//     db.passwords.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
// 	for (var i=0; i<db.passwords.length; i++) {
// 		if (db.passwords[i]['_id'] === id) {
// 			var user = db.passwords[i]
// 			return done (null, user)
// 		}
// 	}
// })

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, foundUser) {
		if (err) {
			done(err, null);
		} else {
			if(!foundUser) { // didn't find a user with that id
				done(null, false);
			} else {
				done(null, foundUser);
			}
		}
	})
})

// PASSPORT MIDDLEWARE HERE
// app.configure(function() {
//   app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

//   app.use(app.router);
// });

// YOUR ROUTES HERE
module.exports = app;

app.get('/', function(req, res) {
	if (!req.user) {
		res.redirect('/login')
	} else {
		console.log(req.user);
		res.render('index', { user: req.user });
	}
})

app.get('/login', function(req, res) {
	res.render('login');
})

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/signup', function(req, res) {
	res.render('signup.hbs');
})

app.post('/signup', function(req, res) {
	req.check('username', 'Username is required').notEmpty();
	req.check('password', 'Password is required').notEmpty();
	var error = req.validationErrors();
	if (error) {
		res.send(error) 
	} else {
		var newUser = new User ({
			Username: req.body.username,
			Password: hashPassword(req.body.password)
		})
		newUser.save(function(err) {
			if (err) {
				res.send(err)
			}
		})
		res.redirect('/login')
	}
})

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

app.listen(3000);