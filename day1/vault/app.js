"use strict";

console.log('---------STARTING------------');

var fs = require('fs');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var validator = require('express-validator');
var Strategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
var db = require('./passwords.hashed.json');

//Hashing
var crypto = require('crypto');
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
app.use(cookieParser());
app.use(validator());
app.use(session({
  secret: 'luls',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));



// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://lisahoong:horizon1@ds139979.mlab.com:39979/lisa-horizons');

//MODELS
var User = mongoose.model('User', {
  username: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

// Validation
function validate(req) {
  req.checkBody({
    'username': {
      notEmpty: true,
      errorMessage: "Please enter a username"
    },
    'password': {
      notEmpty: true,
      errorMessage: "Please enter a password"
    }
  })
}


// SESSION SETUP HERE



// PASSPORT LOCALSTRATEGY HERE
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, found) {
      if (err) {
        console.log("Error", err);
      } else {
        if (found.password === hashPassword(password)) {
          done(null, found);
        }
      }
    })
  }
));
// passport.use(new Strategy(
//   function(username, password, done) {
//     var hashed = hashPassword(password);
//     for (var i = 0; i < db.passwords.length; i++) {
//       if (db.passwords[i].username === username) {
//         if (db.passwords[i].password === hashed) {
//           myUser = db.passwords[i];
//           break;
//         } else {
//           console.log('Incorrect password');
//         }
//       }
//     }
//     done(null, myUser);
//   }
// ))


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, found) {
    console.log(found);
    if (err) {
      console.log('Error', err);
    } else {
      done(null, found)
    }
  })
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user,
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local',
  { successRedirect: '/',
    failureRedirect: '/login'})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  validate(req);
  var newUser = new User({
    username: req.body.username,
    hashedPassword: hashPassword(req.body.password)
  });
  newUser.save(function(err) {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect('/login');
    }
  });
})

module.exports = app;

app.listen(3000);
