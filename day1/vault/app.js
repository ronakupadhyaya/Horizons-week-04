"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models.js');
console.log(models); 
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
  console.log('Connected to MongooseDb!');
});
mongoose.connect('mongodb://user:pass@ds131742.mlab.com:31742/passport');
// SESSION SETUP HERE
app.use(session({
  secret: 'My Secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({username: username}, 'username hashedPassword _id', function(err, found) {
      console.log(found);
      if (!found) {
        done(null, false);
      } else if (found.hashedPassword === hashPassword(password)) {
        done(null, found);
      } else {
        done(null, false);
      }
    });   
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  var user = false;
  models.User.findById(id, function(err, found) {
    if (err) {
      console.log(err);
    }
    user = found;
    done(null, user);
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {user: req.user});
  } else {
    res.redirect('/login');
  }  
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
  if (!req.body.username) {
    res.redirect('/signup');
  } else if (!req.body.password) {
    res.redirect('/signup');
  } else {
    var newUser = new models.User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect('/login');
  }
});

// Hashing Function
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

module.exports = app;
