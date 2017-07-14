"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var db = require('./passwords.hashed.json').passwords;
// var session = require('cookie-session');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models');

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
  console.log('connected to mongoDb');
});
mongoose.connect('mongodb://maymay:maymaymay@ds061335.mlab.com:61335/vaultmay')

// SESSION SETUP HERE
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }))
app.use(session({
  secret: "May's secret",
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy (
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    User.findOne({
      username: username
    }, function(err, user) {
      if (user && user.hashedPassword === hashedPassword) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  }
));
// change this hashed stuff

// passport.use(new LocalStrategy (
//   function(username, password, done) {
// //     var hashedPassword = hashPassword(password);
// //     for (var i=0; i<db.length; i++) {
// //       if(username === db[i].username && hashedPassword === db[i].password) {
// //         return done(null, db[i]);
// //       }
// //     }
// //   return done(null, false);
// // }
// // ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user){
    return done(err, user);
  });
})
//   for (var i=0; i<db.length; i++) {
//     if (id === db[i]._id) {
//       var user = db[i];
//       done(null, user);
//       return;
//     }
//   }
//   return done(null, false);
// })

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user})
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function (req, res) {
  //express-validator - need to validate this
  var username = req.body.username;
  var password = req.body.password;
  var addUser = new User({
    username: username,
    hashedPassword: hashPassword(password)
    // this is also wrong
  })
  addUser.save(function(err, user) {
    if (err) {
      console.log("Can't add user", err);
    } else {
      res.redirect('/login')
    }
  })
})


module.exports = app;
