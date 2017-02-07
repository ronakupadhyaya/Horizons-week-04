"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordData= require('./passwords.hashed.json');
var data = passwordData.passwords

var User = require('./models/models');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connect('mongodb://haminko:hyaqmji8nh@ds145019.mlab.com:45019/haminko_vault');

// SESSION SETUP HERE

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'passwordson',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password)
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== hashedPassword) {
        return done(null, false, { message: 'Incorrect password.' });
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
    if (err) { return done(err)}
    done(null, user)
  });
  // var user = data.filter(function(a) {return a._id === id})[0]
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login')
  }
  res.render('index', {
    user: req.user
  })
});

app.get('/login', function(req, res) {
  res.render('login')
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
  var hashedPassword = hashPassword(req.body.password)

  var newUser = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  if (req.body.username === '' || req.body.password === '') {
    res.status(301).json({"Error": "Missing Information"})
  } else {
    var usernameExists = false
    User.find(function(err, users) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === newUser.username) {
            res.status(400).json("Username already in use")
            usernameExists = true;
        };
      };
      if (usernameExists === false) {
        newUser.save(function(err) {
          if (err) {
            res.status(400)
          } else {
            res.redirect('/login')
          };
        });
      }
    });
  }
});

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}

module.exports = app;

app.listen(3000);
