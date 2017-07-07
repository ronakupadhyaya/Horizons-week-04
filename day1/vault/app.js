"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var userStorage = require('./passwords.hashed.json').passwords
var session = require('express-session')
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)
var User = require('./models/models.js')
var crypto = require('crypto')

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
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
  console.log('Connected to MongoDB')
})
mongoose.connect(process.env.MONGODB_URI)

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE

passport.use(new Strategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    User.findOne({username: username}, function(err, user) {
      if (err) {
        done(err, false)
      } else if (user) {
        if (hashedPassword === user.hashedPassword) {
          console.log("Successful login")
          done(null, user)
        }
      } else {
        done(null, false)
      }
    })
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log("Error occured while deserializing user")
      done(err, false)
    } else if (user) {
      done(null, user)
    } else {
      console.log("New user exists with given id")
      done(null, false)
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(session({
  secret: 'trust the process',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user
    });
  } else {
    res.redirect('/login')
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    new User({
      username: username,
      hashedPassword: hashPassword(password)
    }).save(function(err) {
      if (!err) {
        res.redirect('/login')
      } else {
        console.log('Error occured while saving new user')
      }
    })
  }
})

module.exports = app;
