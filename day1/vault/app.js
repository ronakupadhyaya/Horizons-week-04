"use strict";

var express = require('express');
var models = require('./models/models')
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json');
var hashedPasswords = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));
// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    models.User.findOne({
      username: username,
      hashedPassword: hashedPassword
    }, function(error, user) {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });

    // var hashedPassword = hashPassword(password);
    // function isHashedUser(element) {
    //   return element.username === username && element.password === hashedPassword;
    // }
    // var user = hashedPasswords.passwords.find(isHashedUser);
    // if (user === null) {
    //   return done(null, false);
    // } else {
    //   return done(null, user);
    // }
}));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function (error, user) {
    if (error) {
      return done(error);
    }
    done(null, user);
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res, next) {
  if (req.user) {
    res.render('index', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res, next) {
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

app.get('/signup', function(req, res, next) {
  res.render('signup');
});

app.post('/signup', function(req, res, next) {
  var u = new models.User({
    username: req.body.username,
    hashedPassword: hashPassword(req.body.password)
  });
  u.save(function(error, user) {
    if (!error) {
      res.redirect('/login');
    }
  });
});

module.exports = app;
app.listen(3000);
