/*jslint node: true */
"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require("./passwords.hashed.json");
var User = require("./models/models.js").User;


var crypto = require("crypto");

function hashPassword(password) {
  var hash = crypto.createHash("sha256");
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

var mongoose = require("mongoose");
mongoose.connection.on("connected", function() {
  console.log("Connected to MongoDB...");
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
var expressSession = require("express-session");
var MongoStore = require("connect-mongo")(expressSession);

app.use(expressSession({
  secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: require("mongoose").connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;





passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        return done(null, false, { message: 'Database error.' });
      } else if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        if (user.password !== hashPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log("Error finding user");
    } else if (!user) {
      console.log("User not in db");
    } else {
      done(null, user);
    }
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res, next) {
  console.log("user",req.user);
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render('index', {user: req.user});
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate('local', {failureRedirect: "/login"}),
function(req, res) {
  res.redirect("/");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.post("/signup", function(req, res) {
  var hashedPassword = hashPassword(req.body.password);
  new User(
    {
      username: req.body.username,
      password: hashedPassword
    }).save(function(err){
      if (err) {
        res.status(500).send("Error saving user");
      } else {
        res.redirect("/login");
      }
    });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = app;
