"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var passwords = require('./passwords.hashed.json').passwords;
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;
var validator = require('express-validator');

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// MONGODB SETUP HERE

mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});

mongoose.connect(process.env.MONGODB_URI)

// SESSION SETUP HERE

app.use(session({
  secret: 'super_secure',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username,
      hashedPassword: hashPassword(password)
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log('Error: internal database error!');
    } else {
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  req.checkBody('username', 'Error: missing username.').notEmpty();
  req.checkBody('password', 'Error: missing password.').notEmpty();

  if (req.validationErrors()) {
    res.send(req.validationErrors());
  } else {
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    newUser.save(function(err) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.redirect('/login');
      }
    });
  }
});

module.exports = app;
