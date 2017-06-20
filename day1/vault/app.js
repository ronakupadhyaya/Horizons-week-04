"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
  ,LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto')
var User = require('./models/models.js').User

//hashing function
function hashPasswords(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
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
  console.log('connected to mongoDb');
})
mongoose.connect('mongodb://alexlatif:gdelnobolo1@ds133162.mlab.com:33162/vaultexe')
// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user){
      if(hashPasswords(password) === user.hashPassword){
        done(null, user)
      }else{
        done(null, false)
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  console.log('deserializeUser')
  User.findById(id, function(err, user){
    if(err){
      done(null, false)
    }
    done(null, user)
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(req.user){
    res.render('index', {
      user: req.user,
    })
  } else if(!req.user){
    res.redirect('/login')
  }
})

app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  if(username && password){
    var obj = new User({
      username: username,
      hashPassword: hashPasswords(password)
    })
    obj.save(function(err, success){
      if(err){
        res.status(400).json({"error": "error on saving new user"})
      }
      res.redirect('/login')
    })
  }
})

module.exports = app;
