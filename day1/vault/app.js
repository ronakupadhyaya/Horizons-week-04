"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.plain.json').passwords;
var usersWithHashes = require('./passwords.hashed.json').passwords;
// var session = require('cookie-session');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;
// hashing
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
mongoose.connect('mongodb://smit:bitch@ds145019.mlab.com:45019/horizons-db');

// SESSION SETUP HERE
// As of express v4.x the same answer still applies that passport.
// (...) must be called only after express.session like so:
// These sessions are now stored in node. But everytime node
// restarts it forgets everything, so you're logged out. Now
// let's make sessions stick around i.e. persist using our database, MognoDb.
app.use(session({
  secret: 'smit is a broohaha',
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE
var localStrategy = new LocalStrategy(
  // return done(null, false, { message: 'Incorrect password.' });
  // return done(null, user);
  function(username, password, done) {
    // var validUser = usersWithHashes.filter(function(user) {
    //   return user.username === username && user.password === hashPassword(password);
    // });
    // // check if valid user was returned
    // if (validUser.length && validUser.length === 1) {
    //    done(null, validUser[0]);
    // } else {
    //    done(null, false, { message: 'User or password pair not found.' });
    // }

    User.findOne({
      username: username,
      hashedPassword: hashPassword(password)
    }, function(err, validUser) {
      if (err) {
        console.log("unable to search for a valid login attempt", err);
      } else if (!validUser) {
        done(null, false, { message: 'User or password pair not found.' });
      } else {
        done(null, validUser);
      }
    });
  }
);

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  console.log("in serialize", user, user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  // var user = users.filter(function(user){
  //   return user._id === id
  // });
  // console.log('inside', id, user);
  // done(null, user[0]);
  var user = User.findById(id, function(err, foundUser){
    if(err){
      console.log("unable to deserialize user by id");
    } else if (!foundUser){
      console.log("no user was found");
    } else {
      done(null, foundUser);
    }
  });
});

// PASSPORT MIDDLEWARE HERE
passport.use(localStrategy);

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user);
  if(!req.user){
    res.redirect('/login');
  } else{
  res.render('index', {user: req.user});
}
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  var user = req.body;
  User.findOne({username: user.username}, function(err, foundUser){
    if(err){
      res.redirect('/signup');
    }
    else if (foundUser){
      res.redirect('/signup');
    }
    else {
      var newUser = new User({
        username: user.username,
        hashedPassword: hashPassword(user.password)
      });
      newUser.save(function(err){
        if(err){
          console.log("There was an error while saving", err);
        }
        else {
          req.logIn(newUser, function(err) {
            if (err) {
              console.log("there was an error logging in newly created user");
            } else {
              res.redirect('/');
            }
          })
        }
      });
    }
  });
});
module.exports = app;
