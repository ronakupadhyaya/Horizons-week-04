"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");
var flash = require('connect-flash');
var mongoose = require('mongoose');
var db = require('./passwords.hashed.json');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Hash function
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session({secret: 'spongebob',
  store: new MongoStore({mongooseConnection: require('mongoose').connection}),
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) { //done is a cb function
    User.findOne({username: username}, function(err, user) {
      if(err) {
        done(err, null);
      } else {
        if(!user) {
          done(null, false);
        } else {
          if(user.hashedPassword === hashPassword(password)) {
            done(null, user);
          } else {
            done(null, false, { message: 'Incorrect password.'});
          }
        }
      }
    });
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) { // db search unsuccessful
      done(err, null);
    } else {
      if(!user) { // db search successful, no user found
        done(null, false);
      } else { // db search successful, user found
        done(null, user);
      }
    }
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if(!req.user) { // not logged in yet, redirect to '/login'
    res.redirect('/login');
  } else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res) {
  res.render('login', {messages: req.flash('error')});
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.',
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  if(!req.body.username || !req.body.password) {
    res.status(400).send('Missing either username or password input fields.');
  } else {
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password),
    });
    newUser.save(function(err) {
      if(err) {
        res.status(500).send('Failed to make user due to database error.');
      } else {
        res.redirect('/login');
      }
    });
  }
});

app.listen(3000, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('Express server listening on port 3000');
  }
})
module.exports = app;
