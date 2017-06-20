"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var _ = require('underscore');
var passwordJsonFile = require('./passwords.plain.json');
var hashedPasswords = require('./passwords.hashed.json');


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require("mongoose");
mongoose.connection.on('connected', function() {
  console.log("Connected to MongoDb");
});
mongoose.connect("mongodb://jtomli:lowermayfair@ds131512.mlab.com:31512/jtomli-vault");
var models = require("./models/models.js")
var User = models.User;

// SESSION SETUP HERE
//using cookies:
// var session = require('cookie-session');
// app.use(session({
//   keys: ["secret12345"],
//   maxAge:1000*60*2
// }));
//using express
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: "mySecret",
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


var passport = require('passport');
// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    //using non-hashed
    //var user = _.findWhere(passwordJsonFile["passwords"], {username: username, password: password});
    //using hashed
  //   var hashedPassword = hashPassword(password);
  //   var user = _.findWhere(hashedPasswords["passwords"], {password: hashedPassword});
  //   console.log("user 1", user);
  //   if(user) {
  //     done(null, user);
  //   } else {
  //     done(null, false);
  //   }
  // }
    //using db
    User.findOne({username: username, hashedPassword: hashPassword(password)}, function(error, foundUser) {
      if(error || !foundUser) {
        done(null, false);
      } else {
        done(null, foundUser);
      }
    });

}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var user = _.findWhere(passwordJsonFile["passwords"], {_id: id});
  // console.log("user 2", user);
  //   done(null, user);
  User.findById(id, function(error, foundUser) {
    if(error) {
      res.json({error: "Error deserializing user"});
    } else {
      done(null, foundUser);
    }
  });

});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

//PASSWORD HASHING
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// YOUR ROUTES HERE
app.get("/", function(req, res) {
  console.log(req.user);
  if(req.user) {
    res.render("index", {user: req.user});
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function(req, res) {
  res.render("login")
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: "/login"
}));

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get("/signup", function(req, res) {
  res.render('signup');
});

app.post("/signup", function(req, res) {
  if (req.body.username && req.body.password) {
    var newUser = new User({username: req.body.username, hashedPassword: hashPassword(req.body.password)});
    newUser.save(function(error, savedUser) {
      if(error) {
        res.json({error: "Error saving user"});
      } else {
        res.redirect('/login');
      }
    })
  } else {
    res.render('signup');
  }
});


module.exports = app;
