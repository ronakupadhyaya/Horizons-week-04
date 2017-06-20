"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local')
  .Strategy;
var dB = require('./passwords.hashed.json');
var _ = require('underscore');
// var session = require('cookie-session')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var User = require('./models/models')
  .User;

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
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://asif:asif@ds133162.mlab.com:33162/vault521')

// SESSION SETUP HERE
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// I'm asif and i'm lame and i'm not funny
// this is a cool stand
// mu back doesnt feel much fetter thoughwswfghnyjfdd2iudglzj1rfuhkjnzgrdi


// app.use(session({
//   keys: ['secret password'],
//   maxAge: 1000 * 60 * 2
// })) ///                              IS THIS CORRECT?

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(function(username, password, done) {
//   var validation = false;
//   var userObj;
//   User.findOne(, function(user) {
//     var hashedPassword = hashPassword(password);
//     if (user.username === username && user.password === hashedPassword) {
//       userObj = user;
//       validation = true;
//     }
//   })
//
//   if (validation === true) {
//     done(null, userObj);
//   } else {
//     done(null, false);
//   }
// }))

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      var hashedPassword = hashPassword(password);
      if (user.hashedPassword !== hashedPassword) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));
// Hashing and protecting passwords
var crypto = require('crypto');

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) { // checks wristband when requests enters
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user /// IS THIS CORRECT
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', function(req, res) {
  res.render('login', {})
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
})

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var user = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    user.save(function(err, savedUser) {
      if (err) {
        console.log('User was not saved', err);
      } else {
        res.redirect('/login');
      }
    })
  };
})
module.exports = app;
