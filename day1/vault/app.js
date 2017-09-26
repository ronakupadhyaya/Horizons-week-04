"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var session = require('cookie-session');
var passwordsPlain = require('./passwords.plain.json');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

passport.use(new LocalStrategy(
  function(username, password, cb) {
    var user = false;
    passwordsPlain.passwords.forEach(function(item, index) {
      if (item.username === username && item.password === password) {
        user = item;
      }
    });
    cb(null, user);
  }
));

app.use(session({
  keys: [process.env.SECRET],
  maxAge: 1000*60*1,
}));

app.use(passport.initialize()); // TODO what do these do?
app.use(passport.session()); // this MUST be run after app.use(session());



// TODO why not put serialize and deserialize above app.use(passport)?
passport.serializeUser(function(user, cb) {cb(null, user._id);});

passport.deserializeUser(function(id, cb) {
  var user = false;
  passwordsPlain.passwords.forEach(function(item, index) {
    if (id === item._id) {
      user = item;
    }
  });
  cb(null, user);
});


app.get('/', function(req, res) {
  if (!req.user) {res.redirect('/login');}
  else {res.render('index', {user: req.user});}
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect();
});

module.exports = app;
