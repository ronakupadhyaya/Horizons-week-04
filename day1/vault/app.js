"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.plain.json').passwords;
var cookieSession = require('cookie-session');
var session = require('express-session');
var hashes = require('./passwords.hashed.json').passwords;



var crypto = require('crypto');
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




// PASSPORT MIDDLEWARE HERE
app.use(cookieSession({
  keys:['secret password'],
  maxAge:1000*60*2
}))
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log("inside serializeUser", user)
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById({_id: id}, function (err, found) {
    done(null, found)
  })

  }
})


var mongoose = require('mongoose');
mongoose.connect('mongodb://mtroyanovsky1:zinger1@ds151078.mlab.com:51078/vault');
// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb')
});
// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}))
// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    for (var i = 0; i < hashes.length; i++) {
      done(null, false);
    }
  }
  ));






  // YOUR ROUTES HERE
  app.get('/', function(req, res) {
    console.log("Here", req.user);
    if(req.user) {
      res.render('index', {user: req.user})
    } else {
      res.redirect('/login')
    }
  })

  app.get('/login', function (req, res) {
    res.render('login')
  })

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))


  app.get('/logout', function(req, res) {
    console.log("hello");
    req.logout();
    res.redirect('/');
  });


  app.get('/signup', function(req, res) {
    res.render('signup');
  })

  app.post('/signup', function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function(err, user) {
      if(err) {
        var newUser = new User({
          username: username,
          password: password
        })
        newUser.save();
        res.redirect('/login');
      } else {
        res.send("This username already exists")
      }
    })
  })






module.exports = app;
