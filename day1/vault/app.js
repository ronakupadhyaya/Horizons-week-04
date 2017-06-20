"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json');
var passwordsHash = require('./passwords.hashed.json');
// var session = require('cookie-session');
var models = require('./models/models.js');
var User = models.User;


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose=require('mongoose');
mongoose.connection.on('connected',function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }));
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'Your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

passport.use(new passportLocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        done(err);
      } else if (!user) {
        done(null, false);
      }else if (user.password === hashPassword(password)){
        done(null, user);
      } else {
        done(null, false);
      }
    })
    // passwordsHash.passwords.forEach(function(user) {
    //   if (user.username === username && user.password === hashPassword(password)) {
    //     console.log('found user in passport local strat');
    //     done(null, user);
    //   }
    // });
    // done(null, false);
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log('serializes user');
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializes user');
  User.findOne({_id: id}, function(err, user) {
    if (err) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
});

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log('reaches get / with: '+req.user);
  if (req.user) {
    console.log("reaches render user");
    res.render('index',{user:req.user});
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'})
);

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  if (req.body.username && req.body.password) {
    var user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });

    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/login')
      }
    })
  } else {
    res.redirect('/signup');
  }
})

module.exports = app;
