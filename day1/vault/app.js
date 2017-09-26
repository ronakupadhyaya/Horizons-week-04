"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var passwordList = require('./passwords.hashed.json')
var handlebars = require('handlebars')
var expresshandlebars = require('express-handlebars')
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('./models/models.js')
console.log(passwordList.passwords);
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE

var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'myDogBuddha',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPasswordInput = hashPassword(password);
    var found;
    for(var i = 0; i < passwordList.passwords.length; i++) {
      console.log(passwordList.passwords[i]);
      if (passwordList.passwords[i].username === username && passwordList.passwords[i].password === hashedPasswordInput) {
        console.log("username and password matches");
        found = true;
        done(null, passwordList.passwords[i]);
      }
    }
    if (!found){
      console.log('user is not in list');
      done(null, null);
    }
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('trying to deserialize');
  User.find(id, function(err, user) {
    if(err) {
      done(err + 'sorry bud', null);
    } else {
        console.log(id);
        done(null, user);
      }
  });
});

  // var user;
  //   for (var i = 0; i < passwordList.passwords.length; i++) {
  //     if(passwordList.passwords[i]._id === id) {
  //       user = passwordList.passwords[i].username;
  //       done(null, user);
  //     }
  //   }
// });
console.log(hashPassword('middl3ware'));
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
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
if (!req.body.username || !req.body.password) {
  res.status(400).send('Missing either Username or Password');
} else {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser.save(function(err) {
    if(err) {
      res.send(err);
    }else {
      res.redirect('/');
    }
  });
}
})


module.exports = app;

app.listen(3000);
