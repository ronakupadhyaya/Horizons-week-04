"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
var passwords = require('./passwords.hashed.json').passwords;
var expressValidator = require('express-validator');

var User = require('./models/models').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);


// SESSION SETUP HERE
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

app.use(
  session({
    secret: 'my face',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
  }));

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    // var hashedPassword = hashPassword(password);
    // var foundUser = null;
    // passwords.forEach(function(user, index){
    //   if(user.username === username && user.password === hashedPassword){
    //     foundUser = user;
    //   }
    // })
    // done(null,foundUser);

    User.findOne( {username: username, hashedPassword: hashPassword(password)}, function(error, result){
      if(error){
        console.log(error);
        done(null, null);
      } else if (!result){
        done(null, null);
      } else {
        done(null, result);
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id)
})

passport.deserializeUser(function(id, done){
  // var foundUser = null;
  // passwords.forEach(function(user, index){
  //   if(user._id === id){
  //     foundUser = user;
  //   }
  // })
  // done(null, foundUser);
  User.findById( id , function(error, result){
    if(error){
      console.log(error);
      done(null, null);
    } else if (!result){
      console.log("No user with that id exists");
      done(null, null);
    } else {
      console.log("Found user!");
      done(null, result);
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
  } else {
    res.render('index', {user: req.user});
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
  req.check('username', 'you must provide a username').notEmpty();
  req.check('password', 'you must provide a password').notEmpty();

  var errors = req.validationErrors()
  if(errors){
    console.log(errors);
  } else {
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    })
    newUser.save(function(error, result){
      if(error){
        console.log('Failed to save new user');
      }else{
        console.log('New user successfully saved');
        res.redirect('/login');
      }
    })
  }
})

module.exports = app;
