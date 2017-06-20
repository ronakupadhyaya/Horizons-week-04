"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');

var crypto = require('crypto')

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
mongoose.connect(process.env.MONGODB_URI);

var User = require('./models/models.js')

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret:'thelr4t45y5khadsy5kHJGKHG',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))


// PASSPORT LOCALSTRATEGY HERE
var localStrategy = require('passport-local').Strategy
var passwords = require('./passwords.hashed.json');

passport.use(new localStrategy(
  function(username, password, done){
    var hashedPassword = hashPassword(password)
    User.findOne({username: username}, function(err, user) {
      if (err || user === null){
        done(null, false)
      } else if (user.hashedPassword===hashedPassword) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id)
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err)console.log(err);
    done(null, user)
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());



// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user})
  }
});
app.get('/login', function(req, res){
  res.render('login')
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
  var hashedPassword = hashPassword(req.body.password);
  var username = req.body.username

  var newUser = new User({
    username: username,
    hashedPassword: hashedPassword
  })

  newUser.save(function(){
    res.redirect('/login')
  })
})

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}

module.exports = app;
