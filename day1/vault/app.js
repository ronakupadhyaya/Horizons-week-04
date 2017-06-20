"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var crypto = require('crypto');
var models = require('./models/models')
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
})
mongoose.connect("mongodb://evan.peterson1324:Darkwolf1324@ds027385.mlab.com:27385/evan-horizons-login");

// SESSION SETUP HERE
app.use(session({
  secret: 'flame',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
  }
));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var foundUser = findUserByName(username);
    var hashedPassword = hashPassword(password);
      if(!foundUser) {
        return done(null, false, {message: "Incorrect Username!"});
      }
      if(foundUser.password !== hashedPassword) {
        return done(null, false, {message: "Incorrect Password!"})
      }
      return done(null, foundUser);
  })
)

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  var user = findUserById(id); // Find the user with our helper function
  done(null, user);
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  //console.log(req.user);
  if(!req.user) {
    res.redirect('/login')
  } else {
      res.render('index', {user: req.user});
  }

});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res) {
  // Validate the username and pw fields from req.body
  var password = hashPassword(req.body.password);
  var newUser = new models.User({
    username: req.body.username,
    hashedPassword: password
  })
  newUser.save(function(err, user) {
    if(err) {
      console.log(err);
      res.status(500).redirect('/register');
      return;
    }
    console.log(user);
    res.redirect('/login');
  });
})

// This is a helper function to find the user in our json file
function findUserByName(username) {
  var jsonFile = require('./passwords.hashed.json');
  var userArr = jsonFile.passwords;
  var returnUser;
  userArr.forEach(function(user){
    if(username === user.username) {
      returnUser = user;
    }
  })
  return returnUser;
}

function findUserById(id) {
  var jsonFile = require('./passwords.hashed.json');
  var userArr = jsonFile.passwords;
  var returnUser;
  userArr.forEach(function(user){
    if(id === user._id) {
      returnUser = user;
    }
  })
  return returnUser;
}

// Apply our hash to the password login attempt
function hash(password) {
  return crypto.createHash('sha256').digest('hex');
}

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

app.listen(3000);
module.exports = app;
