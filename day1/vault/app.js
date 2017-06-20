"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models');
var User = models.User;

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var data = User["passwords"];

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('connected to mongo')
})
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session({
  secret: 'whales are the best animal',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      else {
        var hashedPassword = hashPassword(password);
        if (username === user["username"]) {
          var storedPassword = user["hashedPassword"];
          if (storedPassword === hashedPassword) {
            return done(null, user);
          }
        }
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  User.findById(id, function(err, user) {
    if (err) {
      console.log('deserializeUser', err)
    }
    else {
      done(null, user);
    }
  })
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  }
  else {
    res.render('index', {user: req.user});
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
  res.redirect('/login');
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    })
    newUser.save(function(err, user) {
      if (err) {
        console.log('signup', err)
      }
      else {
        res.redirect('/login');
      }
    })
  }
})
module.exports = app;
