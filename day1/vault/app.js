"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passwords = require('./passwords.plain.json');
var hashPasswords = require('./passwords.hashed.json');
var cookies = require('cookie-session');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var validate = require('express-validator');
var user = require('./models/models.js').user;

//mongoose
mongoose.connection.on('connected', function() {
  console.log("CONNECTED");
});
mongoose.connect('mongodb://daniel:horizons@ds145039.mlab.com:45039/vault');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//hash
var crypto = require('crypto');


// MONGODB SETUP HERE


// SESSION SETUP HERE
app.use(session({
  secret: 'cashmeousside',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// app.use(cookies({
//   keys: ['cashmeousside'],
//   maxAge: 1000*60*10
// }));

// PASSPORT LOCALSTRATEGY HERE
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username, "wasuuhhh");
    user.findOne({username: username}, function(err, user) {
      if (!user) {
        done(null, false, {message: "incorrect username"});
      }
      if (user.password === hashPassword(password)) {
        console.log("lmaooooo");
        done(null, user);
      }
    })
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      done(null, user);
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());





// YOUR ROUTES HEReE


app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('index', {user: req.user});
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

//SIGNUP

app.get('/signup', function(req, res) {
  res.render('signup');
})


function validate(req) {
  req.checkBody('username', 'name man').notEmpty();
  req.checkBody('password', 'passworddd man').notEmpty();
}

app.post('/signup', function(req, res) {
  validate(req);
  var user2 = new user({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
  user2.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  })
})



app.listen(process.env.PORT || 3000);
module.exports = app;
