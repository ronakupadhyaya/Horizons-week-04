"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models.js')

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
  console.log('connected to MongoDB');
});
mongoose.connect('mongodb://vcortes:123@ds131512.mlab.com:31512/vcortes-vault');

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'I have a secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// PASSPORT LOCALSTRATEGY HERE
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

var passdict = require('./passwords.hashed.json').passwords;

passport.use(new LocalStrategy(function(username, password, done) {
  var found = false;
  var hashedPassword = hashPassword(password)
  models.User.findOne({username: username}, function (err, user) {
        if (err) {
          console.error(err);
          return done(err);
        }
        if (!user) {
          console.log(user);
          console.log("Hello3");
          return done(null, false, {message: 'Incorrect username.'});
        }
        if (user.hashPassword !== hashedPassword) {
          console.log("Hello2");
          return done(null, false, {message: 'Incorrect password.'});
        }
        console.log("Hello");
        return done(null, user);
      });
    }
  ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  })
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
    if(!req.user) {
      res.redirect('/login')
    } else {
      res.render('index', {user: req.user})
    }
})

app.get('/login', function(req, res){
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect:  '/login'
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/signup',
 function(req, res) {
   if (!req.body.username || !req.body.password) {
     res.send("Was not able to sign up")
     return
   }
   var newUser = new models.User({
     username: req.body.username,
     hashPassword: hashPassword(req.body.password)
   });
   newUser.save(function(err, newUser){
     if(err) {
       res.json({Failure: "Invalid user signup info"})
     } else {
       res.redirect('/login')
     }
   })
})

module.exports = app;
