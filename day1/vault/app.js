"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var bank = require('./passwords.hashed.json');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models');


// Express setup and middleware
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password)
  return hash.digest('hex')
}

// MONGODB SETUP HERE
mongoose.connect('mongodb://9724.mlab.com:49724/practicevault');
mongoose.connection.on('connected', function() {
  console.log('CONNECTED TO MONGODB');
})
// SESSION SETUP HERE
app.use(session({
  secret: 'nibbit',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPW = hashPassword(password);
    // var output = bank.passwords.find(function(element) {
    //   return (element.username === username && element.password === hashedPW) ? true : false
    // })
    models.User.findOne({
      username: username
    }, function(err, result) {
      if (result.password === hashedPW) {
        done(null, result);
      } else {
        done(null, false);
      }
    })
    // console.log(output);
    // if (output) {
    //   done(null, output)
    // } else {
    //   done(null, false);
    // }
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id)
});
passport.deserializeUser(function(id, done) {
  // var user = bank.passwords.find(function(ele) {
  //   return ele._id === id ? true : false
  // })
  // if (user) {
  //   done(null, user)
  // } else {
  //   console.log('user not found during DESERIALIZE');
  //   done(null, false)
  // }
  models.User.findById({
    _id: id
  }, function(err, user) {
    done(null, user)
  })
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    console.log('failed to set user but correct UN and PW');
    res.redirect('/login')
  } else {
    console.log(req.user);
    res.render('index', {
      user: req.user
    });
  }
})
app.get('/login', function(req, res) {
  res.render('login');
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})
app.get('/signup', function(req, res) {
  res.render('signup')
})
app.post('/signup', function(req, res) {
  var newUser = new models.User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  })
  newUser.save(function(err) {
    res.redirect('login')
  })
})
module.exports = app;
