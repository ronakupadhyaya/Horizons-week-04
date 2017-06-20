"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var passportLocal = require('passport-local')
var passwordplainJson = require('./passwords.plain.json')
var passwordhashedJson = require('./passwords.hashed.json')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto')
var models = require('./models/models')
var User = models.User


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'very secret secret',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});
mongoose.connect("mongodb://rhong:2424@ds133162.mlab.com:33162/vault-richard")

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// MONGODB SETUP HERE

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy( // based on passwordplainJson
//   function(username, password, done) {
//     var credentials = passwordplainJson.passwords
//     var flip = false;
//     credentials.forEach(function(x) {
//       if (x.username === username && x.password === password) {
//         flip = true;
//         done(null, {"username": username, "password": password, "_id": x._id})
//       }
//     })
//     if (!flip) {
//       done(null, false)
//     }
//   }
// ));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password);
//     var credentials = passwordhashedJson.passwords
//     var flip = false;
//     credentials.forEach(function(x) {
//       if (x.username === username && x.password === hashedPassword) {
//         flip = true;
//         done(null, {"username": username, "password": hashedPassword, "_id": x._id})
//       }
//     })
//     if (!flip) {
//       done(null, false)
//     }
//   }
// ));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { done(err); }
      if (!user) {
        done(null, false, { message: 'Incorrect username.' });
      }
      if (user.hashedPassword !== hashPassword(password)) {
        done(null, false, { message: 'Incorrect password.' });
      }
      done(null, user);
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, foundUser){
    done(null, foundUser);
  });
  // var user = passwordplainJson.passwords[id-1]
})
// hashPassword function

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user})
  }
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/' ,
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  if (typeof req.body.password === "string" && typeof req.body.username === "string" && req.body.password.length !== 0 && req.body.username.length !== 0) {
    var hashedPassword = hashPassword(req.body.password);
    var user = new User ({username: req.body.username, hashedPassword: hashedPassword})

    user.save(function(err, saveduser){
      res.redirect('/login')
    });
  }
})

module.exports = app;
