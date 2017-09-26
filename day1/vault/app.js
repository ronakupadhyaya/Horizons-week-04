"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.plain.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var hashdb = require('./passwords.hashed.json');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
var User = require('./models/models')

var app = express();



//console.log(hashPassword(db.passwords[0].password));

// app.use(session({
//   keys: ['a'],
//   maxAge: 1000*60*2
// }))
//console.log(db)

app.use(session({
  secret:'a',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// Express setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connect('mongodb://vaultuser:gymnastics@ds147864.mlab.com:47864/vaultpractice')

// SESSION SETUP HERE
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     for(var i = 0; i < db.passwords.length; i++){
//       if(db.passwords[i].username === username && db.passwords[i].password === password){
//       console.log(db.passwords[i])
//         return done(null, db.passwords[i]);
//       } //if(db.passwords[i].username === username && db.passwords[i].password !== password){
//   }
//   return done(null, false);
// }
// ))

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     for (var i = 0; i<hashdb.passwords.length; i++){
//       if (hashdb.passwords[i].password === hashPassword(password)){
//         return (null, user)
//       }
//     }
//   return (null,user)
// }));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username:username}, function (error, result){
      if (result.password === hashPassword(password)){
        done (null, result);
      } else {
      done(null, result)
    }
  })
}
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
//     var user = {}
//     var err = true
//     db.passwords.forEach(function(person){
//     if (person._id === id){
//       user=person
//       err = false
//     }
//   });
//   done (err, user)
// });

passport.deserializeUser(function(id,done) {
  User.findById(id, function(error, user){
    if (error){
      done(error, user);
    } else {
      done (null, user)
    }
  })
})

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req,res){
//  console.log(req) // there is no user property of req
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user});
}
});
app.get('/login', function(req,res){
  res.render('login')
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function (req,res){
  res.render('signup')
});

app.post('/signup', function(req,res){
  User.findOne({
    username: req.body.username
  }, function(error, result){
    if (error){
      console.log('first', error);
      res.send(error)
    } else if (result === null) {
        var newUser = new User ({
          username: req.body.username,
          password: hashPassword(req.body.password)
        });
      newUser.save(function(error, result){
        if (error) {
          console.log('second', error);
          res.send(error)
        } else {
          res.redirect('/login')
        }
      })
    } else {
      console.log("User already exists")
      res.redirect("/login")
    }
  });
});


module.exports = app;
