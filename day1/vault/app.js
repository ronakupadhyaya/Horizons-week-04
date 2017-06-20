"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var users = require('./passwords.hashed.json');
var crypto = require('crypto');
var User = require('./models/models').User


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));



// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!');
});
mongoose.connect('mongodb://tim:tim@ds131432.mlab.com:31432/w04d1_vault')

// SESSION SETUP HERE
// cookieSession
// var cookieSession = require('cookie-session');
// app.use(cookieSession({
//   name: 'session',
//   keys: ['poophello'],
//   maxAge: 1000*5
// }));
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'poophello',
  store: new MongoStore({
  mongooseConnection: mongoose.connection
  })
}))

// password hashing
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(

  function(username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) { return done(null, false, {message: 'Something went wrong'}); }
      else {
        if (user.password === hashPassword(password)) {
            console.log(user);
            done(null, user);
            return;
          }
        }
        done(null, false, { message: 'Incorrect username.'});
    })
  }));


app.use(passport.initialize());
app.use(passport.session());
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){

  User.findById(id, function(err, user){
    if (user) {
      done(null, user)
    } else {
      done(null, false);
    }
    console.log('deser' + user);


  })

});



// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log('get request /', req.user);
  if(!req.user){
    res.redirect('/login');
  } else {
    console.log(req.user);
    res.render('index', {
      user: req.user
    });
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/' ,
  failureRedirect: '/login'
})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  req.check('username', 'Username is required').notEmpty();
  req.check('password', 'Password is required').notEmpty();
  var error = req.validationErrors();

  if(error){
    res.render('signup', {
      error: error
    })
  } else {
    var newPerson = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    })
    newPerson.save(function(err){
      if(err) {
        console.log('something went wrong:', err);
      } else {
        res.redirect('/login')
      }
    });
  }
})

app.listen(3000);

module.exports = app;
