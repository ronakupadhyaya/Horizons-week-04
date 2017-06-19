"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json').passwords;
var session = require('express-session');
var User = require('./models/models.js').User
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// MONGODB SETUP HERE
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session)

mongoose.connection.on('connected',function() {
  console.log('Connected to MongoDb!')
});
mongoose.connect('mongodb://Jingyw:middleware@ds131742.mlab.com:31742/middleware')
// SESSION SETUP HERE
app.use(
  session({
    secret:'i love pizza',
    store:new MongoStore({
      mongooseConnection:require('mongoose').connection
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

var crypto = require('crypto')
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    // User.findOne({ username: username }, function (err, user) {
    var index = -1;
    User.findOne({username:username},function(err,foundUser) {
      if (err || foundUser === null) {
        done(err,false)
      } else {
        done(null, foundUser);
      }
    })
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null,user._id);
})

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,foundUser) {
    if (err || foundUser === null) {
      done(err,false)
    } else {
      done(null,foundUser)
    }
  })
});
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/',function(req,res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index',{
      user:req.user
    });
  }
});

app.get('/login',function(req,res) {
  res.render('login');
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login'
  })
)

app.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup',function(req,res) {
  res.render('signup')
})

app.post('/signup',function(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  req.check('username','username cannot be empty').notEmpty();
  req.check('password','password cannot be empty').notEmpty();
  var err = req.validationErrors();
  if (err) {
    res.redirect('/signup');
  } else {
    console.log("beforenewuser")
    var newUser = new User({username:username,hashedpassword:hashPassword(password)});

    newUser.save(function(err,saved) {
      console.log("saved")
      console.log(err)
      res.redirect('/login');
    });
  }
})
module.exports = app;
