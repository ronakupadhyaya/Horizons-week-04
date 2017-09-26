"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.plain.json');
var hasheddb = require('./passwords.hashed.json');
// var session = require('cookie-session');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models');

function hashPassword(password) {
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
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
// app.use(session({
//   keys: ['ilosemykeys123'],
//   maxAge:1000*10
// }));
app.use(session({
  secret: 'ilosemykeys123',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));



// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {

    var hashedPassword = hashPassword(password);

    models.User.findOne({username: username}, function (err, user) {
      if (err) {
        console.error(err);
        return done(err);
      }
      if (!user) {
        console.log(user);
        return done(null, false);
      }
      if (user.password !== hashedPassword) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));






// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, foundUser) {
    if (err) {
      done(err, null);
    } else {
      if (!foundUser){
        done(null, false);
      } else {
        done(null, foundUser)
      }
    }
  })
})

// PASSPORT MIDDLEWARE HERE
// app.configure(function() {
//   app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
//   app.use(app.router);
// });

// YOUR ROUTES HERE
module.exports = app;

app.get('/', function(req, res) {
  if (!req.user) {
    console.log('hello')
    res.redirect('/login');
  } else {
    console.log('goodbye')
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate ('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
  req.logout();
      res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  var newUser = new models.User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
  newUser.save(function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/login');
    }
  });
});





// console.log(hashPassword('middl3ware'))



app.listen(3000);
