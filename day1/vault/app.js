"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var userFile = require('./passwords.hashed.json');
var LocalStrategy = passportLocal.Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var crypto = require('crypto');
var validator = require('express-validator');
// Express setup
var app = express();
var models = require('./models/models');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());
// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log("CONNECTED!");
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
// app.use(session({
//   keys: ['test'],
//   maxAge: 1000*60*2
// }))
app.use(session({
  secret:"test",
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    // var users = userFile.passwords;
    // var hashedPass = hashPassword(password);
    // // console.log("userFile:", userFile);
    // // console.log("users:", users);
    // // console.log("userFile.password", userFile.passwords);
    // var verified = false;
    // var user;
    // users.forEach(function(u) {
    //   if (u.username === username && u.password === hashedPass) {
    //     verified = true;
    //     user = u;
    //   }
    // });
    // verified ? done(null, user) : done(null, false);
    models.User.findOne({
      //get user by username
      username: username
    }, function(err, user) {
      if (err) {
        console.log(err);
      } else if (!user) {
        console.log("not in database");
      } else if (user.hashedPassword === hashPassword(password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
}));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var users = userFile.passwords;
  // var user;
  // users.forEach(function(u) {
  //   if (u._id === id) {
  //     user = u;
  //   }
  // });
  // done(null, user);
  models.User.findById(id, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      if (!found) {
        console.log('not found');
      } else {
        done(null, found);
      }
    }
  });
})
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res){
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('index', {
      user: req.user
    });
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup');
});

app.post('/signup', function(req,res) {
  req.checkBody('username', 'username cant be empty').notEmpty();
  req.checkBody('password', 'password cant be empty').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
  } else {
    var newUser = new models.User({username: req.body.username, hashedPassword: hashPassword(req.body.password)});
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
  }
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));
app.listen(process.env.PORT || 3000);
module.exports = app;
