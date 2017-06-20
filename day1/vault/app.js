"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var plainJson = require('./passwords.plain.json')
var hashedJson = require('./passwords.hashed.json')

var models = require('./models/models.js');
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
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect("mongodb://maxwell3739:Btln3739@ds131432.mlab.com:31432/vault3739")

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'btln3739',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

//FUNCTION TO FIND USER WITH SPECIFIC ID
var findUser = function(id) {
  // var found = null
  // var array = plainJson.passwords
  // array.forEach(function(currentObj) {
  //   if(currentObj._id === id) {
  //     found = currentObj
  //   }
  // })
  // return found
  var u = {};
  User.findById(id, function(err, user) {
    u = user;
  })
}

// PASSPORT LOCALSTRATEGY HERE
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.hashedPassword !== hashPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(!err && user) {
      done(null, user);
    }
    else {
      done(null,false);
    }
  })
})
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req,res) {
  if (!req.user) {
    res.redirect('/login')
  }
  else {
    res.render('index', {user: req.user})
  }
})

app.get('/login', function(req,res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  var user = new User ({
    username: req.body.username,
    hashedPassword: hashPassword(req.body.password)
  });

  user.save(function(err, savedUser){
    res.redirect('/login')
  })
})

module.exports = app;
