"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var accounts = require('./passwords.hashed.json').passwords;
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js');

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

// MONGODB SETUP HERE
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});

// SESSION SETUP HERE
app.use(session({
  secret: 'asdfghjkl',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    password = hashPassword(password);
    User.findOne({
      username: username
    }, function(error, user) {
      if (user && user.password === password) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})
passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, user) {
    if (user) {
      done(null, user);
    } else if (error) {
      console.log(error);
    } else {
      console.log("This user doesn't exist.  No error returned.");
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user
    })
  } else {
    res.redirect('/login');
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    })
    user.save(function(err) {
      if (err) {
        res.send(`Error: ${err}`);
      } else {
        res.redirect('/login');
      }
    })
  }
})

module.exports = app;
