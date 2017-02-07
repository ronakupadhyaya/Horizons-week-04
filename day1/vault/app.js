"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var data = require('./passwords.plain.json');
var data2 = require('./passwords.hashed.json');
// var cookies = require('cookie-session')
var mongoose = require('mongoose');
var session = require('express-session');


// Express setup
var app = express();

var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookies({
//   keys: ['signature'],
//   maxAge: 10000 //cookie will be valid for two minutes (now ten seconds)
// }));

// app.use(session({secret: 'your secret here'}))
app.use(session({
  secret: 'yoursecret',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}))

mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://user:pass@ds033477.mlab.com:33477/vault')


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
  });

passport.deserializeUser(function(id, done) {
  data.passwords.forEach(function(item) {
    var id1 = item._id;
    if (id === id1) {
      var user = item;
      done(null, user);
    }
  })
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    data2.passwords.forEach(function(item) {
      var user = item.username;
      var pass = item.password;
      if (user === username && pass === hashedPassword) {
        console.log('yes')
        return done(null, item);
      }})
        console.log('no')
        done(null, false)
    }));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     data.passwords.forEach(function(item) {
//       var user = item.username;
//       var pass = item.password;
//       if (user === username && pass === password) {
//         return done(null, item);
//       }})
//         done(null, false)
//     }));

    // passport.use(new LocalStrategy(
    //   function(username, password, done) {
    //     data.passwords.forEach(function(item) {
    //       var user = item.username;
    //       var pass = item.password;
    //       if (user !== username || pass !== password) {
    //         console.log(user)
    //         console.log(pass)
    //         console.log(username)
    //         console.log(password)
    //         return done(null, false);
    //       }})
    //         done(null, item)
    //         console.log('something')
    //     }));
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     for (var i=0; i<data.passwords.length; i++)
//     data.passwords.forEach(function(user) {
//       if (user.username !== password || user.password !== username) {
//         return done(null, false, {message: 'Incorrect username or password'});
//       }
//       else {
//         return done(null, user)
//       }
//     })
//   })
// );

app.get ('/', function(req, res) {
  if (!req.user) {
    res.redirect('login')
  }
  else if (req.user) {
    res.render('index', {user: req.user})
  }
});

app.get ('/login', function(req, res) {
  res.render('login')
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// MONGODB SETUP HERE

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

module.exports = app;
