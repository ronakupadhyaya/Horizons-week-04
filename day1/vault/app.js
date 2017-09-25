"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
var Strategy = require('passport-local').Strategy;
var passwordsPlain = require('./passwords.plain.json');

passport.use(new Strategy(
  function(username, password, done) {
    var bool = false;
    var idx;
    passwordsPlain.passwords.forEach(function(item, index) {
      if (item.username === username && item.password === password) {
        bool = true;
        idx = index;
      }
    });
    if (bool) {
      done(null, passwordsPlain.passwords[idx]);
    }
    else {
      done(null, bool);
    }
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(user, done) {
//   done(null, user._id);
// });

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})
);

module.exports = app;
