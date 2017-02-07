"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords= require('./passwords.plain.json').passwords;
var hashPasswords = require('./passwords.hashed.json').passwords;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('connected to MongoDb!!');
});
mongoose.connect('mongodb://day1:day1@ds145039.mlab.com:45039/week4day1')
// SESSION SETUP HERE
app.use(session({
  secret: 'secretSECRETsecret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

passport.serializeUser(function(user,done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById( id,function(err,user){
    if(err) throw err;
    else{
      done(null, user);
    }
  });
});
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username,password, done){
    User.findOne({username: username}, function(err,user){
      if(err) {
        console.error(err)
        return done(err);
      }
      if(!user) {
        console.log('Username not found');
          return done(null, false, {message: 'Incorrect username.'});
      }
      else{
        if(user.password === hashPassword(password)){
          console.log('passwords matched');
          return done(null, false, {message: 'Incorrect password.'});
        }
        else{
          console.log('no password matched');
          //done(null, false);
        }
      }
    });
    hashPasswords.forEach(function(user){
      if(user.username === username && user.password === hashPassword(password)){
        return done(null, user);
      }
    });
    return done(null, false, { message: 'username or password incorrect'})
  }));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/',function(req,res){
  if(req.user){
    res.render('index.hbs', {user: req.user});
  }else{
     res.redirect('/login');
  }
});

app.get('/login', function(req,res){
  res.render('login.hbs')
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req,res){
  res.render('signup.hbs');
});

app.post('/signup', function(req,res){
  var user = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
  User.findOne({username: user.username}, function(err,user){
    if(err) throw err;
    if(user){
      console.log('username ' + user.username + ' already taken');
      res.redirect('/signup');
    }
  });
  user.save(function(err){
    if(err) req.status(500).json(err)
    else{
      res.redirect('/login');
    }
  });
});



module.exports = app;
