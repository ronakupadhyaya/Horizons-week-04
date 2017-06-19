"use strict";

var express       = require('express'),
    path          = require('path'),
    logger        = require('morgan'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    localDB       = require('./passwords.plain.json').passwords;

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

console.log(localDB);
passport.use(new LocalStrategy(
  function(username, password, done) {

    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

module.exports = app;
