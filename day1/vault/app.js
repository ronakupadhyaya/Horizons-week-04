"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// OLD SESSION SETUP
// var session = require('cookie-session');

// NEW SESSION SETUP
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// cryptographic hash
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

var passwords_plain = require('./passwords.plain.json');

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
  console.log("Connected to MongoDB!!!!!!! :D");
});
mongoose.connect(process.env.MONGODB_URI);

// OLD SESSION SETUP HERE
// app.use(session({
//   keys: ['Pradyut likes carrots'],
//   maxAge: (1000*60) / 6
// }));

 // NEW SESSION SETUP HERE
app.use(session({
  secret: 'Pradyut likes carrots',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    passwords_plain.passwords.forEach(function(user){
      if(user.username === username){
        if(user.password === password){
          return done(null, user);
        }else{
          return done(null, false, { message: "Incorrect password."});
        }
      }
    });
    return done(null, false, {message: 'Incorrect username.'});
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  for(var i = 0 ; i < passwords_plain.passwords.length ; i++){
    var user = passwords_plain.passwords[i];
    if(user._id === id){
      done(null, user);
      return;
    }
  }
  done(null, false, {message: "Incorrect id"});
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
//  user has not logged in
  if(!req.user){
    res.redirect('login');
  }else{
    res.render('index', {
      user: req.user
    });
  }
  // res.render('index');

});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

app.listen(3000);

module.exports = app;
