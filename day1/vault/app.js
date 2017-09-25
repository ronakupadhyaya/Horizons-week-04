"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

// var session = require('cookie-session'); // not confidential - atob('cookie value') will decode
var session = require('express-session'); // confidential
var MongoStore = require('connect-mongo')(session);

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
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(session({
//   keys: ['my super secret password'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret: process.env.SECRET_BENG,
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

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

passport.deserializeUser(function(id, done) {
  var user = null;
  passwordsPlain.passwords.forEach(function(item, index) {
    if (id === item._id) {
      user = item;
    }
  });
  done(null, user);
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {res.redirect('/login');}
  else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = app;
