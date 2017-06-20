"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
// var passportLocal = require('passport-local');
var passwords = require('./passwords.hashed.json');
var session = require('express-session')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models');
var User = models.User;

mongoose.connection.on('connected', function() {
  console.log('connected to mongo')
});
mongoose.connect('mongodb://corey:pass123@ds131742.mlab.com:31742/anotherapp');


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

// MONGODB SETUP HERE

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hash = hashPassword(password);
    User.findOne({ username: username }, function (err, foundUser) {
       if (err) {
         done(err);
       } if (!foundUser) {
         done(null, false, { message: 'Incorrect foundUsername.' });
       } if (foundUser.password === hash) {
         done(null, foundUser);
       };
     });
   }
  //   var users = passwords.passwords;
  //   var hash = hashPassword(password);
  //   var flip = false
  //   users.forEach(function(x){
  //     if(x.username === username && x.password === hash) {
  //       flip = true;
  //       var user = {"username": username, "password": password, "_id": x._id}
  //       done(null, user)
  //     }
  //   })
  //   if (!flip) {
  //     done(null, false)
  //   }
  // }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, foundUser){
    if(err){
      done(err)
    } else{
      done(null, foundUser);
    }
  })
})


function hashPassword (password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user})
  }
})

app.get('/login', function(req, res){
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  if(typeof req.body.password === 'string'
  && typeof req.body.username === 'string'
  && req.body.password.length !== 0
  && req.body.username.length !== 0){
    var newUser = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    newUser.save(function(err, user){
      if(err){
        res.json({failure: "error"})
      } else {
        res.redirect('/login');
      }
    })
  }
})

module.exports = app;
