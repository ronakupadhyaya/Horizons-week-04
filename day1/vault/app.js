"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
//require passport and passport-local
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;

//hash password function
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


// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://jklugherz:horizons1@ds131782.mlab.com:31782/julia-passport-app');


// SESSION SETUP HERE
//--> cookie session
app.use(session({
  secret: 'my secret password',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashed = hashPassword(password);
    // for (var i = 0; i < db.passwords.length; i++) {
    //   if (db.passwords[i].username === username && db.passwords[i].password === hashed) {
    //     //console.log('found user');
    //     done(null, db.passwords[i]);
    //     return;
    //   }
    // }
    User.findOne({
      username: username,
      password: hashed
    }, function(err, user) {
      if (err) {
        console.log('error', err);
        done(null, false);
      } else {
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      }
    })
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log('error finding by id', err);
      done(null, false);
    } else {
      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    };
  });
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    console.log('user not found');
    res.redirect('/login');
  } else {
    console.log('user found');
    res.render('index', {
      user: req.user
    });
  };
});

app.get('/login', function(req, res) {
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

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    user.save(function(err, user) {
      if (err) {
        console.log('could not save user.')
      } else {
        res.redirect('/login');
      };
    });
  };
});


module.exports = app;
