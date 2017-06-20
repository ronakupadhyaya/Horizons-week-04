"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var models = require('./models/models')
var User = models.User;


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb')
})
mongoose.connect('mongodb://chloe:chloe@ds131492.mlab.com:31492/week04day1')

var expressValidator = require('express-validator')
app.use(expressValidator());

// SESSION SETUP HERE

var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})}));

// HashPassword
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


//Passport Setup
var passport = require('passport');


// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = require('passport-local').Strategy;
var passwordsFile = require('./passwords.hashed.json').passwords

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    var goodUsername = false;
    var goodPassword = false;
    var user2={}
    passwordsFile.forEach(function(user){
      console.log(user)
      if(user.username === username){
        goodUsername = true;
        user2[username] = username;
        user2['_id'] = user['_id'];
      }
      if(user.password === hashedPassword){
        goodPassword = true;
        user2[password] = hashedPassword;
      }
    })
    if(goodUsername === false && goodPassword ===true) {
      return done(null, false, { message: "Incorrect username"});
    }
    if(goodUsername === true && goodPassword === false) {
      return done(null, false, { message: "Incorrect password"});
    }
    return done(null, user2);
  }
))
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  var user = passwordsFile.find(function(user){
    return user._id === id;
  })
  done(null, user);
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session())

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user)
  if(!req.user){
    res.redirect('/login')
  }
  res.render('index', {user: req.user})
})

app.get('/login', function(req, res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  req.checkBody('username', 'Please enter a username').notEmpty();
  req.checkBody('password', 'Please enter password').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.redirect('/signup')
  } else {
    var user = new User({username: req.body.username, password: req.body.password})
    user.save(function(err){
      if(err){
        console.log(err)
      } else {
        res.redirect('/login')
      }
    })
  }
})

module.exports = app;
