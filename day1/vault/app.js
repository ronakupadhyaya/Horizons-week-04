"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
var config = require("./config.js");
var mongoose = require("mongoose");
var User = require("./models/models").User;
mongoose.connection.on("connected", function() {
  console.log("Connected to database.");
})
mongoose.connection.on("error", function() {
  console.log("Failed to connect to database. Make sure that you have connection to the internet and that your URI is provided in config.js.");
});
mongoose.connect(config.MONGODB_URI);

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: config.SESSION_KEY,
  store: new MongoStore({ mongooseConnection: require('mongoose').connection })
}));


// HASHING
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);

    User.findOne({ username: username }, function(err, user) {
      console.log(user);
      if (err || !user) {
        console.log("Cannot find user");
        done(null, false, { message: "User not found." });
      } else {
        if (hashedPassword === user.password) {
          console.log("match");
          done(null, user);
        } else {
          console.log("invalid password");
          done(null, false, { message: "Invalid password"});
        }
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log("serializing");
  return done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log("User not found!");
      done(null, false, { message: "User not found!"});
    } else {
      done(null, user);
    }
  })
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get("/", function(req, res) {
  if (req.user) {
    res.render("index", {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }

});

app.get('/login', function(req, res) {
  res.render('login', {});
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
  res.render("signup");
});

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    }).save(function(err, user) {
      if (err) {
        console.log("Cannot save user!");
      } else {
        res.redirect('/login');
      }
    });
  }
});

module.exports = app;
