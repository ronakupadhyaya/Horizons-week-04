"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var passwordBank = require('./passwords.hashed.json');
var users = passwordBank.passwords;
var models = require('./models/models.js');
var User = models.User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MONGODB!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session({
  secret: 'my secret',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// PASSPORT LOCALSTRATEGY HERE
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, foundUser) {
      if (!foundUser) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (hashPassword(password) === foundUser.hashedPassword) {
        return done(null, foundUser);
      }
      return done(null, false, { message: 'Incorrect password.' });
    });
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log('1');
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, foundUser) {
    if (err) {
      res.status(500).send('Database lookup error');
    } else {
      done(null, foundUser);
    }
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log(req.user);
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('index', {user: req.user});
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
  if (!req.body.username || !req.body.password) {
    redirect('/signup');
    return;
  } else {
    var new_user = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    new_user.save(function(err) {
      if (err) {
        res.status(500).send('Database Error');
      } else {
        res.redirect('/login');
      }
    });
  }
})

module.exports = app;


