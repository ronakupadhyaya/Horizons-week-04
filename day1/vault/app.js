"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var plain = require('./passwords.plain.json');
var hash = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;
function hashPassword(password){
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
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('Conencted to MongoDB');
});
mongoose.connect('mongodb://sophia:qwerty@ds131492.mlab.com:31492/passportdb');


// SESSION SETUP HERE
app.use(session({
  secret: 'secret secret secret secret',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// PASSPORT LOCALSTRATEGY HERE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== hashPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err || !user){
      console.log("couldn't find user", err);
      done(null, false);
    } else {
      done(null, user);
      }
  });
})
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

app.get('/', function(req, res){
  if(!req.user){
    res.redirect("/login");
  } else {
    res.render('index', {
      user: req.user
    });
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/signup', function(req, res){
    res.render('signup');
  })

  app.post('/signup', function(req, res){
    if(req.body.username && req.body.password){
      var newUser = new User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      })
      newUser.save(function(err, user){
        if(err){
          console.log("oops! couldn't save user");
        } else {
          res.redirect('/login')
        }
      })
    }
  })


module.exports = app;
