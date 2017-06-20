"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressValidator = require('express-validator');
var User = require('./models/models').User;
// var cookieSession = require('cookie-session');

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
app.use(expressValidator());

// app.use(cookieSession({
//   keys: ["hello there"],
//   maxAge: 1000*60*2
// }));

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log("Connected to MongoDB!");
})
mongoose.connect('mongodb://jeffreyxchen:1234@ds131432.mlab.com:31432/passport-exercise');

// SESSION SETUP HERE
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

app.use(session({
  secret: "this is the secret",
  store: new mongoStore({
    mongooseConnection: require('mongoose').connection
  })
}))

// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.hashed.json');
var userPasswords = users.passwords;

passport.use(new LocalStrategy(
  // function(username, password, done) {
  //   for(var i = 0; i < userPasswords.length; i++){
  //     if(username === userPasswords[i].username && password === userPasswords[i].password){
  //       return done(null, userPasswords[i]);
  //     }
  //   }
  //   done(null, false);
  // }

  // function(username, password, done){
  //   var hashedPassword = hashPassword(password);
  //   for(var i = 0; i < userPasswords.length; i++){
  //     if(username === userPasswords[i].username && hashedPassword === userPasswords[i].password){
  //       return done(null, userPasswords[i]);
  //     }
  //   }
  //   done(null, false);
  // }

  function(username, password, done){
    console.log(hashPassword(password));
    User.findOne({username: username, password: hashPassword(password)}, function(err, user){
      if(err){
        done(null, false);
      }
      else{
        done(null, user);
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  // var valid = false;
  // userPasswords.forEach(function(user, index){
  //   if(id === user._id){
  //     done(null, user);
  //     valid = true;
  //   }
  // })
  // if (!valid) {
  //   done(null, false);
  // }
  User.findById(id, function(err, user){
    if(err){
      done(null, false);
    }
    else{
      done(null, user);
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    res.render('index', {
      user: req.user
    });
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
  req.checkBody('username', 'You must have a username').notEmpty();
  req.checkBody('password', 'You must have a password').notEmpty();
  var newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
  newUser.save(function(err, user){
    if(err){
      console.log('Error: no new user saved (' + err + ')');
    }
    else{
      console.log('New user successfully saved!');
      res.redirect('/login');
    }
  })
})

module.exports = app;
