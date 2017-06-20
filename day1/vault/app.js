"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var usersPlain = require('./passwords.plain.json');
var usersHash = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models.js');
var User = models.User;
var validator = require('express-validator');

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// Express setup
var app = express();
// var router = express.Router();

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
mongoose.connection.on('error', function() {
  console.log('cannot connect to database');
})
mongoose.connection.on('connected', function() {
  console.log('connected successfully');
})
mongoose.connect(process.env.MONGODB_URI);

app.use(session({
  secret: 'haha funny',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))
// SESSION SETUP HERE
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashPsw = hashPassword(password);
    var ifTrue = false;
    var user = new Object();
    // console.log(usersPlain);
    User.findOne({
      username: username,
      password: hashPsw
    }, function(err, target) {
      if (err) console.log(err);
      else {
        ifTrue = true;
        user['username'] = target.username;
        user['password'] = target.password;
        user['_id'] = target.id;

        if (ifTrue === true) done(null, user);
        else done(null, false);
      }
    })

  }
))
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})
passport.deserializeUser(function(id, done) {
  var user = new Object();
  User.findById(id, function(err, target) {
    if (err) console.log(err);
    else {

      user['username'] = target.username;
      user['password'] = target.password;
      user['_id'] = target.id;
      done(null, user);
    }
  })


})
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log(req.user);
  if (!req.user) res.redirect('/login');
  else res.render('index', {
    user: req.user
  })
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
  res.redirect('/login');
});
app.get('/signup', function(req, res) {
  res.render('signup');
})
app.post('/signup', function(req, res) {
  req.checkBody('username', 'Username must not be empty').notEmpty();
  req.checkBody('password', 'Password must not be empty').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    user.save(function(error) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/login');
      }
    });
  }
})
module.exports = app;
