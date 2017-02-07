"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json');
var mongoose = require('mongoose');
// var session = require('cookie-session'); no longer needed
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto')
var validator = require('express-validator')
var User = require('./models/models').User;

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in config.js');
  process.exit(1);
});

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connect('mongodb://andrewmin8:lakerskb24@ds145039.mlab.com:45039/ballsack');

// SESSION SETUP HERE
app.use(session({
  secret: 'bubblebooty',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection}),
  maxAge: 1000*60*2
}))

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password);
//     for(var i = 0; i < passwords.passwords.length; i++) {
//       console.log(passwords.passwords[i])
//       if(passwords.passwords[i].username === username) {
//         console.log('were good');
//         if(passwords.passwords[i].password === hashedPassword) {
//           console.log('still good');
//           return done(null, {
//             "username": username,
//             "password": password
//           })
//         }
//           return done(null, false, {
//             message: 'Incorrect password'
//           })
//       }
//     }
//       return done(null, false, {
//         message: 'Incorrect username'
//       })
//   }
// ))

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('passport')
    User.findOne({username: username}, function(err, foundUser) {
      console.log('inside')
      if(err) {
        console.log(err);
        done(err, null)
      } else if(foundUser.hashedPassword === hashPassword(password)) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    })
  }
));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password);
//   }
// ))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user.username)
})

passport.deserializeUser(function(user, done) {
  User.findOne({username: user}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      done(null, foundUser)
    }
  })
})
// var myUser;
// for(var i = 0; i < passwords.passwords.length; i++) {
//   if(user === passwords.passwords[i].username) {
//     myUser = passwords.passwords[i];
//   }
// }
// done(null, myUser)

// PASSPORT MIDDLEWARE HERE -- SESSION DELETED
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log(' in here')
  if(!req.user) {
    res.redirect('/login');
  } else {
    console.log('hello');
    res.render('index.hbs', {
      user: req.user
    })
  }
})

app.get('/login', function(req, res) {
  res.render('login.hbs')
})

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/signup', function(req, res) {
  res.render('signup.hbs');
})

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: req.body.username}, function(err, foundUser) {
    if(err) {
      console.log(err);
      console.log('database error')
    } else if(foundUser) {
      console.log('user already exists')
      // res.status(200).json({
      //   "success": false
      // })
      res.redirect('/signup')
    } else {
      var user = new User({
        username: username,
        hashedPassword: hashPassword(password)
      })
      user.save(function(err) {
        if(err) {
          console.log('another database error');
        } else {
          // res.status(200).json({
          //   "success": true,
          //   "response": user
          // })
          res.redirect('/login');
        }
      });
    }
  })
})

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

module.exports = app;
console.log('Express started. Listening on port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
