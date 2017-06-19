"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var plain = require('./passwords.plain.json');
var hashed = require('./passwords.hashed.json')
var models = require('./models/models')
var User = models.user;

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
  console.log('Connected to MongoDb!');
})
mongoose.connect('mongodb://tiffany:password@ds131492.mlab.com:31492/vault-tiffany');

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'peanutbutterandjelly123',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// PASSPORT LOCALSTRATEGY HERE
var crypto = require('crypto')
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id)
});
passport.deserializeUser(function(id, done) {
  var curUser;
  User.findById(id, function(err, user) {
    if (err) {
      console.log({failure: err})
    } else {
      return done(null, user);
    }
  })

})

// PASSPORT MIDDLEWARE HERE
passport.use(new LocalStrategy (
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (user.username === username) {
        if (user.password === password) {
          return done(null, user);
        } else {
          return done(null, false, {message: "incorrect password"});
        }
        return done(null, false, {message: "incorrect username"});
      }
    })

    // hashed.passwords.forEach(function(user) {
    //   if (username === user.username) {
    //     if (user.password === hashPassword(password)) {
    //       return done(null, user);
    //     } else {
    //       return done(null, false, {message: "incorrect password"});
    //     }
    //     return done(null, false, {message: "incorrect username"});
    //   }
    // })
  }
));

app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  } else {
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
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({failure: "can't signup"})
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    newUser.save(function(err) {
      if (err) {
        res.json({failure: "cannot save", err})
      } else {
        res.redirect('/login')
      }
    })
  }
})


module.exports = app;
