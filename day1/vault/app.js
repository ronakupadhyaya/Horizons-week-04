"use strict";

var express = require('express');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var bodyParser = require('body-parser');
var plainPasswords = require('./passwords.plain.json');
var hashedPasswords = require('./passwords.hashed.json');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;
//var session = require('cookie-session');

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
  console.log('Connected to MongoDb!');
});
var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);

// SESSION SETUP HERE
/*app.use(session({
  keys: ['my very secret password'],
  maxAge: 1000*60*2
}));*/
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    // In milliseconds, i.e., five minutes
    maxAge: 1000 * 60 * 5
  },
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    var found = false;
    /* arr.forEach(function(user) {
      if (user.username === username && user.password === hashedPassword) {
        found = true;
        done(null, user);
      }
    });
    if (!found) {
      done(null, false);
    } */
    User.findOne({
      username: username,
      hashedPassword: hashedPassword
    }, function(err, user) {
      if (!err && user !== null) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  var arr = plainPasswords.passwords;
  User.findById(id, function(err, user) {
    if (!err && user !== null) {
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index.hbs', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login.hbs');
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
  res.render('signup.hbs');
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log("Username: " + username);
  console.log("Password: " + password);

  var alreadyExists = false;
  var arr = plainPasswords.passwords;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].username === username) {
      alreadyExists = true;
      break;
    }
  }
  console.log("Already exists: " + alreadyExists);

  if (!alreadyExists && username.length > 0 && password.length > 6) {
    new User({
      username: username,
      hashedPassword: hashPassword(password),
      _id: plainPasswords.passwords.length + 1
    }).save(function(err, user) {
      if (err) {
        console.log("ERROR");
        res.status(400).send(err);
      } else {
        console.log("SUCCESS");
        res.redirect('/login');
      }
    });
  } else {
    res.status(400).render('signup.hbs');
  }
});

console.log('Express started. Listening on port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);

module.exports = app;
