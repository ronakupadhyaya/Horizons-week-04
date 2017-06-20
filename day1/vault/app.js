"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var usersPlain = require('./passwords.plain.json');
var usersHash = require('./passwords.hashed.json');
// var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var validator = require('express-validator');
var models = require('./models/models.js');
var User = models.User;

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
app.use(validator())
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000 * 60 * 2
// }));


app.use(session({
  secret: 'your secret here',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// MONGODB SETUP HERE

mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODBURI);


// SESSION SETUP HERE
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashPass = hashPassword(password);
    var isTrue = false;
    var user = new Object();
    usersHash.passwords.forEach(function(item) {
      var name = item.username;
      var pass = item.password;
      if (username === name && hashPass === pass) {
        user[username] = name
        user[password] = pass
        user['_id'] = item['_id']
        isTrue = true
      }
    })
    if (isTrue) done(null, user)
    else done(null, false)

  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  var user = new Object()
  usersPlain.passwords.forEach(function(item) {
    var name = item.username;
    var pass = item.password;
    var userId = item._id;
    if (userId === id) {
      user['username'] = name;
      user['password'] = pass;
      user['id'] = userId;
    }
  })
  done(null, user)
})

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {
      user: req.user
    })
  }
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  req.checkBody('username', 'username must not be empty').notEmpty();
  req.checkBody('password', 'password must not be empty').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    })
    user.save(function(error) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/login')
      }
    })
  }
})

module.exports = app;









//
