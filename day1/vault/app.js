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
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};
var User = require('./models/models');

// var passArray = require('./passwords.hashed.json').passwords;

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
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://dbuser:pass@ds145019.mlab.com:45019/passportexercise');

// SESSION SETUP HERE
app.use(session({secret: 'heyo mayo entropy k.o.', store: new MongoStore({mongooseConnection: mongoose.connection})}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, plainPassword, done) {
    var password = hashPassword(plainPassword);
    User.findOne({username: username}, function(err, user) {
      if (err || user.hashedPassword !== password) {
        console.log("issue");
        done(null, false);
      } else {
        console.log("we good");
        done(null, user);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var userArray = passArray.filter(function(passObj) {
  //   return passObj._id === id;
  // });
  console.log("desrialize called");
  User.findById(id, function(err, user) {
    if (err) {
      console.log("deserialize error");
      done(null, false);
    } else {
      console.log("proper deserialize");
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res, next) {
  if (req.user) {
    res.render('index', {user: req.user});
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
  var newUser = new User({username: req.body.username, hashedPassword: hashPassword(req.body.password)});
  console.log(newUser);
  newUser.save(function(err) {
    if (err) {
      res.status(500).json({error: "Couldn't save user."});
    } else {
      res.redirect('/login');
    }
  })
});

module.exports = app;
