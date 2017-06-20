"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var plain = require('./passwords.plain.json')
var hash = require('./password.hashed.json')
var session = require('cookie-session')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//??
// app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// app.use(session({
//   keys:['cookiepassword'],
//   maxAge:1000*10
// }));

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}

// part3
app.use(session({
  secret: 'secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('connected to database')
})
mongoose.connect('mongodb://yarusophia:Toronto1@ds131492.mlab.com:31492/week4day1vault')

// SESSION SETUP HERE
app.use(passport.initialize());
app.use(passport.session());


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    plain.passwords.forEach(function(user) {
      console.log('check user')
      if (user.username === username && user.password === password) {
        console.log('check user', user)
        return done(null, user)
      }

    })
    return done(null, false,  {message: 'Incorrect username or password.' })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) { //mandantory
  done(null, user._id); // once login, no need to login again
});

passport.deserializeUser(function(id, done) {  //mandantory
  var user;
  plain.passwords.forEach(function(user) {
    console.log('deserializeUser')
    if (user._id === id) {
      console.log('check user', user)
      done(null, user)
    }

  });

});
// PASSPORT MIDDLEWARE HERE


// YOUR ROUTES HERE
app.get('/', function(req, res) {
    // res.render('index');
    if (!req.user) {
      res.redirect('/login')
    } else {
      res.render('index', {
        user: req.user
      })
    }
  });

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login' })
);

app.get('/login', function(req, res) {
    console.log('get login')
    res.render('login');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    newUser = 
  }
})


module.exports = app;
