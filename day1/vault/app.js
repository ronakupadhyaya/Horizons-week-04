"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var users = require('./passwords.hashed.json');
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
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://lizzie:password@ds027385.mlab.com:27385/week4vault')
// SESSION SETUP HERE

var session = require ('express-session');
var MongoStore = require ('connect-mongo')(session)
app.use(session({
  secret: 'pass',
  store: new MongoStore({mongooseConnection: require('mongoose').connection.on('connected', function (){
    console.log('Connected to connect-mongo')
  })})
}));

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// PASSPORT LOCALSTRATEGY
passport.use(new localStrategy(
  function (username, password, done) {
    models.User.findOne({username: username, password:hashPassword(password)}, function (err, user){
      if (hashPassword(password) === user.password){
        done(null, user);
      }
      else {
        done(null, false);
      }
    })
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id)
});

passport.deserializeUser(function(id, done){
  console.log("deserializeUser" + id);
  User.findById(id,function(err, user){
    if(user){
      done(null, user);
      console.log(user);
      return;
    }
    else {
      done(null, false)
    }
  })
})
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get("/", function (req, res){
  console.log("get/" + req.user);
  if (!req.user){
    res.redirect('/login');
  }
  else {
    res.render('index', {
      user: req.user
    })
  }
})

app.get('/login', function (req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
});

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  var password = hashPassword(req.body.password)
  var u = new User({
    username: req.body.username,
    password: password
  });
  u.save(function(err){
    if (!err){
      res.redirect('/login');
    }
  });
})
module.exports = app;
