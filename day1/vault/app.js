"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var database = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
var models = require('./models/models');
var User = models.User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'I murdered my grandmother this morning.',
  store: new MongoStore({mongooseConnection: require('mongoose').connection
})
}))

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log("connected to mongoDB");
});
mongoose.connect("mongodb://ryanclyde:RC5mlab@ds131782.mlab.com:31782/vault-db")

// SESSION SETUP HERE
// app.use(passport.initialize());
// app.use(passport.session());


// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     for (var i = 0; i < database.passwords.length; i++) {
//       if(username === database.passwords[i].username && password === database.passwords[i].password) {
//         //console.log('success');
//         return done(null, database.passwords[i]);
//       }
//     } return done(null, false);
//   }
// ));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password);
//     for (var i = 0; i < database.passwords.length; i++) {
//       if(username === database.passwords[i].username && hashedPassword === database.passwords[i].password) {
//         //console.log('success');
//         return done(null, database.passwords[i]);
//       }
//     } return done(null, false);
//   }
// ));
passport.use(new LocalStrategy(
  function(username, password, done) {
    var kashish = hashPassword(password);
    User.findOne({ username: username }, function (err, user) {
      if (user.hashedPassword === kashish) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

// passport.deserializeUser(function(id, done){
//   var user;
//   for (var i = 0; i < database.passwords.length; i++){
//     if (id === database.passwords[i]._id) {
//       user = database.passwords[i];
//       //console.log('litttt');
//       return done(null, user);
//     }
//   }
//   console.log('could not deserialize user');
//   return done(null, false);
// })

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      return done(null, false)
    } else {
      return done(null, user)
    }
  })
})

// PASSPORT MIDDLEWARE HERE
// var session = require('cookie-session');
// app.use(session({
//   keys: ['help ive fallen and I cannot get up'],
//   maxAge: 1000*60*2
// }));

app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res){
  if(!req.user){
    res.redirect('login');
  } else {
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
  failureRedirect: 'login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password),
      _id: req.body.username + Date.now()
    });
    newUser.save(function(err, usr){
      if (err) {res.json({text: "could not save new account"})}
      else {
        res.redirect('/login');
      }
    })
  } else { console.log("error signing up.")}
})


module.exports = app;
