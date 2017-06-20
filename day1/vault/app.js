"use strict";
var models = require('./models/models')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto');
var User = models.User;

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}



// passport setup
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var db = require('./passwords.plain.json')
var dbHashed = require('./passwords.hashed.json')

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
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://jeremyhorizons:PassWord12#@ds131492.mlab.com:31492/jeremyvault')

// SESSION SETUP HERE


app.use(session({
  secret: 'secret code',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE

var users = db.passwords;
var hashedUsers = dbHashed.passwords;
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username, password: hashPassword(password)}, function(err, user){
      console.log(user);
      if (user.password === hashPassword(password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log("hi");
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user) {
    if (err) {
      done(null, false)
    } else {
      done(null, user)
    }
  });
});

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (req.user) {
    res.render('index',{
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  }));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup')
});

app.post('/signup', function(req, res) {
  if(req.body.username.trim() !== "" && req.body.password.trim() !== "") {
    var newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
    });
    newUser.save(function(err, usr) {
      if (err) {
        res.redirect('/signup');
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/signup');
  }
});
module.exports = app;
