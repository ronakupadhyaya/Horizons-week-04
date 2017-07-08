"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var User = require('./models/models').User;

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
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);

// Hash
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// SESSION SETUP HERE
// app.use(require('cookie-session')({
//   keys: ['You never know.'],
//   maxAge: 1000*60*2
// }));
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'You never know.',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var db = require('./passwords.hashed.json');

passport.use(new LocalStrategy(
   function(username, password, done) {
     var hashedPassword = hashPassword(password);
    //  for (var i = 0; i < db.passwords.length; i++) {
    //    if (db.passwords[i].username === username) {
    //      var user = db.passwords[i];
    //      if (user.password !== hashedPassword) return done(null, false, { message: 'Wrong Password.'});
    //      return done(null, user);
    //    }
    //  }
    //  return done(null, false, { message: 'Invalid Username.'});
    User.findOne({username: username}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Invalid Username.'});
      if (user.hashedPassword !== hashedPassword) return done(null, false, { message: 'Wrong Password.'});
      return done(null, user);
    })
  })
)


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log('ERROR', err);
    } else {
      done(null, user);
    }
  })
  // for (var i = 0; i < db.passwords.length; i++) {
  //   if (db.passwords[i]._id === id) {
  //     var user = db.passwords[i];
  //     break;
  //   }
  // }
  // done(null, user);
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('index.hbs', {
      user: req.user
    });
  }
})

app.get('/login', function(req, res) {
  res.render('login.hbs');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup.hbs');
})

app.post('/signup', function(req, res) {
  if (req.body.username.length !== 0 && req.body.password.length !== 0){
    new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    }).save(function(err, user) {
      if (err) {
        console.log('ERROR', err);
      } else {
        console.log('CREATED', user);
        res.redirect('/login');
      }
    })
  }
})

app.listen(3000);
module.exports = app;
