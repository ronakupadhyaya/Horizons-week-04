"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var database = require('./passwords.hashed.json')
var models = require('./models/models')
var User = models.User

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
  console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE


// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password)
//     for(var i=0; i<database.passwords.length; i++) {
//       if (username === database.passwords[i].username && hashedPassword === database.passwords[i].password) {
//         return done(null, database.passwords[i])
//       }
//     } return done(null,false)
//   }
// ));
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password)
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.hashedPassword !== hashedPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  // var user
  User.findById(id, function(err,user){
    if (err) {
      return done(null, false)
    } else {
      return done(null, user)
    }
  })
  // for (var i=0; i<database.passwords.length; i++) {
  //   if (id === database.passwords[i]._id) {
  //     user = database.passwords[i]
  //     return done(null, user)
  //   }
  // }
  // return done(null, false)
})

// PASSPORT MIDDLEWARE HERE
// var session = require('cookie-session');
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }))
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'this is my secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

app.use(passport.initialize());
app.use(passport.session());

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// YOUR ROUTES HERE
app.get('/', function(req,res){
  if(!req.user){
    res.redirect('/login')
  } else {
    res.render('index', {
      user: req.user
    })
  }
})

app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup')
})

app.post('/signup', function(req,res){
  if (req.body.username && req.body.password) {
    var newUser = new User({
      username: req.body.username,
      _id: req.body.username + new Date(),
      hashedPassword: hashPassword(req.body.password)
    })
    newUser.save(function(err, user){
      if(err) {
        console.log(err)
        res.render('signup')
      } else {
        res.redirect('/login')
      }
    })
  } else {
    console.log("ERROR validating")
    res.render('signup')
  }
})


module.exports = app;
