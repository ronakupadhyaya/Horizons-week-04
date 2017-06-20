"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json');
var hashes = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models.js');
var User = models.User;

var curId = passwords.passwords.length;

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE

mongoose.connection.on('connected', function(){
  console.log("db working.");
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session({
  secret: 'secret password',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false,
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(err){
        console.log(err);
        done(null, false);
      }
      else {
        if(hashPassword(password) === user.password){
          done(null, user);
        }
        else{
          done(null, false);
        }
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err) {
      console.log(err);
    }
    else{
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(req.user){
    res.render('index.hbs', {user: req.user});
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res){
  res.render('login.hbs');
});

app.post('/login', passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    }
  )
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup.hbs');
});

app.post('/signup', function(req, res){
  if(req.body.username.length > 0 && req.body.password.length > 0){
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password),
      id: ++curId
    });
    user.save('session', function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/login');
      }
    });
  }
});

module.exports = app;
