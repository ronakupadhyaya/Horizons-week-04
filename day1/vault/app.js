"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var dataBase = require('./passwords.plain.json');
var hashBase = require('./passwords.hashed.json');
// var session = require('cookie-session');
var mongoose = require('mongoose');
var User = require('./models/models').User;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session(
  {secret: 'I love MONGOS',
   store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSWORD HASHING
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// console.log(hashPassword('WOW'))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new localStrategy(
  function(username,hashedpassword,done) {
    var found;
    User.findOne({Username:username}, function(err,user) {
      if(user.HashedPassword === hashPassword(hashedpassword)) {
        found = true;
        console.log(user.HashedPassword);
        return done(null,user);
      }
      if(!found) {
        console.log('Could not find user in localStrategy function!');
        done(null,false);
      }})}));

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done) {
  done(null,user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function (err,user) {
    console.log(id);
    if(err) {
      console.log('Error finding user in deserializer!')
    } else {
      return done(null,user)
    }})});

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function (req,res) {
  if(!req.user) {res.redirect('/login');}
  else {
    console.log(req.user);
    res.render('index', {user: req.user});
}});

app.get('/login', function (req,res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req,res) {
  res.render('signup');
});

app.post('/signup', function(req,res) {
  if(req.body.username && req.body.password) {
    var user = new User ({
      Username: req.body.username,
      HashedPassword: hashPassword(req.body.password)
    });
    user.save(function(err) {
      if(err) {
        console.log(err)
        res.send('ERROR')
      } else {
        console.log('Success')
        res.redirect('/login');
      }
    });
  }
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
