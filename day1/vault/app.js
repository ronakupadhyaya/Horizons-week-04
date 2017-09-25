"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var validator = require('express-validator');
var User = require('./models/models').User;

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// var session = require('cookie-session'); // not confidential - atob('cookie value') will decode
var session = require('express-session'); // confidential
var MongoStore = require('connect-mongo')(session);



// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(session({
//   keys: ['my super secret password'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret: process.env.SECRET_BENG,
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var Strategy = require('passport-local').Strategy;
var passwordsPlain = require('./passwords.plain.json');
var passwordsHashed = require('./passwords.hashed.json');

// passport.use(new Strategy(
//   function(username, password, done) {
//     var bool = false;
//     var i;
//     // v1: direct string comparison
//     // passwordsPlain.passwords.forEach(function(item, index) {
//     //   if (item.username === username && item.password === password) {
//     //     bool = true;
//     //     i = index;
//     //   }
//     // });
//     // if (bool) {done(null, passwordsPlain.passwords[i]);}
//     // else {done(null, bool);}
//     // v2: hash comparison
//     passwordsHashed.passwords.forEach(function(item, index) {
//       if (hashPassword(password) === item.password && username === item.username) {
//         bool = true;
//         i = index;
//       }
//     });
//     if (bool) {done(null, passwordsHashed.passwords[i]);}
//     else {done(null, bool);}
//   }
// ));

passport.use(new Strategy(
  function(username, password, done) {
    var user = null;
    User.findOne({username: username}, function(errFindingUsing, foundUser) {
      if (hashPassword(password) === foundUser.password) {
        user = foundUser;
        done(null, foundUser);
      }
      else {done(null, user);}
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
//   var user = null;
//   passwordsPlain.passwords.forEach(function(item, index) {
//     if (id === item._id) {
//       user = item;
//     }
//   });
//   done(null, user);
// });

passport.deserializeUser(function(id, done) {
  User.findById(id, function(errFindingUser, foundUser) {
    var user = null;
    if (errFindingUser) {done(null, user);}
    else {
      user = foundUser;
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {res.redirect('/login');}
  else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup')
});

app.post('/signup', function(req, res) {
  req.check('username').notEmpty();
  req.check('password').notEmpty();

  if (req.validationErrors() || typeof req.body.username !== "string" || typeof req.body.password !== "string" ) {res.send("Input fields must be filled in and be strings");}
  else {
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    user.save(function(errSavingUser) {
      if (errSavingUser) {res.send("Error saving user");}
      else {res.redirect('login');}
    });
  }
});

module.exports = app;
