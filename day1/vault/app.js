"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var passwordsPlain = require('./passwords.plain.json');
passport.use(new LocalStrategy(
  function(username, password, done) {
    var user = false;
    passwordsPlain.passwords.forEach(function(item, index) {
      if (item.username === username && item.password === password) {
        user = item;
      }
    });
    done(null, user);
  }
));

app.use(passport.initialize()); // TODO what do these do?
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'})
);

module.exports = app;
