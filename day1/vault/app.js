"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var validator = require('express-validator');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

//console.log(password.passwords);
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
var mongoose = require('mongoose');
mongoose.connection.on('error', function() {
  console.log("Error, could not connect to database.");
});
mongoose.connection.on('connected', function() {
  console.log("Success! Connected to database.");
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// var session = require('cookie-session');  COOKIE SESSIONS
// app.use(session ({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }));
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'jwieriuwiu1A',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var User = require('./models/models.js').User;
var password_file = require('./passwords.plain.json');
var password_hashed = require('./passwords.hashed.json');
passport.use(new LocalStrategy(
  function(username, password, done) {
     var hashedPassword = hashPassword(password);
     //var id = password_hashed.passwords.length + 1;
    // for (var i = 0; i < password_hashed.passwords.length; i++) {
    //   if (password_hashed.passwords[i].username === username && password_hashed.passwords[i].password === hashedPassword) {
    //     console.log('found user');
    //     return done(null, password_hashed.passwords[i]);
    //   }
    // }
    // return done(null, false);
    User.findOne({username: username}, function(err, user) {
      if (err) {
        console.log('error');
      }
      if (user.password === hashedPassword) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) { //store user
  //Use user._id to represent the user in the session.
  done(null, user._id);
})
passport.deserializeUser(function(id, done) { //read user from session
  // for (var i = 0; i < password_file.passwords.length; i++) {
  //   var user = password_file.passwords[i];
  //   if (id === user._id) {
  //     console.log('here');
  //     done(null, user);
  //     return;
  //   }
  // }
  // return done(null, false);
  User.findById(id, function(err, user) {
    console.log('found');
    if (err) {
      return done(null, false);
    }
    return done(null, user);
  });
});



// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) { //not logged in yet
    res.redirect('/login');
  }
  else {
    res.render('index', {
      user: req.user
    });
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  req.check('username', "Username cannot be empty").notEmpty();
  req.check('password', "Password cannot be empty").notEmpty();
  var errors = req.validationErrors();
  if (errors > 0) {
    console.log('error');
  }
  else {
    var hashedPassword = hashPassword(req.body.password);
    var newUser = new User ({
      username: req.body.username,
      password: hashedPassword
    });
    newUser.save(function(err) {
      if (err) {
        console.log('error');
      }
      else {
        res.redirect('/login');
      }
    });
  }
});



module.exports = app;
