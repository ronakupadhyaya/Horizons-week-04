"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var data = require('./passwords.plain.json');
var hashedData = require('./passwords.hashed.json');
var User = require('./public/models/models.js').User

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
mongoose.connection.on('connected', function(err) {
  if(err) {
    console.log(':(');
  } else {
    console.log('Connected :)');
  }
})

mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
var session = require('express-session');
var Mongostore = require('connect-mongo')(session);

app.use(session({
  secret: 'your secret here',
  store: new Mongostore({mongooseConnection: require('mongoose').connection})
  }))

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    password = hashPassword(password);
    console.log(password);
    User.findOne({'username': username, 'password': password}, function(err, user) {
      if(err) {
        console.log(':(');
      } else {
        console.log(user);
        if(user) {
          done(null, user)
        } else {
          done(null, false)
        }
      }
    })


  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById({'_id': id}, function(err, user) {
    if(err) {
      console.log(':(');
    } else {
      if(user) {
        done(null, user)
      }
    }
  })


})


// PASSPORT MIDDLEWARE HERE
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log(req.user);
  if(req.user) {
    res.render('index', {
      user: req.user,
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  })
)

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
});


app.post('/signup', function(req, res) {
  if(req.body.username.length > 0 && req.body.password.length > 0) {
    var newUser = new User({
      'username': req.body.username,
      'password': hashPassword(req.body.password)
    })
    newUser.save();
    res.redirect('/login')
  }
})

module.exports = app;
