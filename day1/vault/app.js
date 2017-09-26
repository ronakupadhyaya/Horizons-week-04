"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./passwords.hashed.json')
var User = require('./models/models');


var crypto = require('crypto');
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
var mongoose = require('mongoose');

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});

var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);


// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'YOUR SECRET HERE',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE
passport.use(new Strategy(
  function(username, password, done){
  var hashedPassword = hashPassword(password)
      User.findOne({username: username}, function(err, user){
        if (user.password === hashedPassword) {
          done(null, user)
        } else {
          done(null, false);
        }
      });
  }
))


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log(user)
    done(null, user);
  });
});
// PASSPORT MIDDLEWARE HERE




// YOUR ROUTES HERE

app.get('/', function(req, res){
  if (req.user){
    res.render('index', {user: req.user});
  } else {
    res.redirect('/login');
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
})
)

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  var user = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
user.save(function(err){
  if (err){
    console.log("There was an error", err)
  } else {
    console.log('success')
    res.redirect('/login')
  }
  })
})

module.exports = app;
