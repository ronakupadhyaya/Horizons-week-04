"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jsonData = require('./passwords.plain.json');
var jsonDataHashed = require('./passwords.hashed.json')
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;

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
  console.log('Connected to MongoDb!')
})
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
};

// LOCALSTRATEGY SETUP HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(error, login) {
      if (error) {
        res.send(error)
      }
      else if (login && hashPassword(login.password) === password) {
        done(null, login)
      } else {
        done(null, false)
      }
    })
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, currUser) {
    if (error) {
      res.send(error)
    } else if (!currUser) {
      done(null, false)
    } else {
      done(null, currUser);
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(session({
  secret: 'anarodriguez',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    console.log("User has not logged in.")
    res.redirect('/login');
  } else {
    res.render('index', {
      user: req.user
    });
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  User.findOne( {username: req.body.username}, function(error, user) {
    if (error) {
      res.render('signup')
    } else if (user) {
      console.log("Given username already exists");
      res.render('signup')
    } else {
      new User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      }).save(function(error) {
        if (error) {
          res.send(error)
        } else {
          res.redirect('/login')
        }
      })
    }
  })
})


module.exports = app;
