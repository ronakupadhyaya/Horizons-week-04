"use strict";
//test
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// var readPassword = require('./passwords.plain.json');
var hashJson = require('./passwords.hashed.json');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models')
var User = models.User;
//hashPassword() function;
var hashPassword = function(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
console.log(hashJson);

// Express setup

// MONGODB SETUP HERE

if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password); //7d3b5c83009fadf734c06eeecd7fbe256c69f71c8ba0429e4d7ad5f54b2e4097
    // var passwordHere = readPassword.passwords;
    var hashPass = hashJson.passwords;
    // console.log(hashPass);
    User.findOne({username: username}, function(err, user) {
        if (err) {
          console.log('error');
        }
        if (user.password === hashedPassword) {
          done(null, user);
        }
        else {
          done(null, false);
        }
      });
    // for (var i = 0; i < hashPass.length; i++){
    //   if(hashPass[i].username === username ){
    //     if (hashPass[i].password === hashedPassword) {
    //       console.log("correct username and password");
    //       return done(null, hashPass[i]);
    //     } else {
    //       console.log('incorrect password');
    //       return done(null, false, {message: "Incorrect password"});
    //     }
    //   }
    // }
    // console.log('incorrect username');
    // return done(null, false, {message: "Incorrect username"});
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})
passport.deserializeUser(function(id, done){
  // console.log(id);
  User.findById(id, function(err, user){
    if(err) {
       done(err);
    }
    // if(!user) {
    //    done(null, false, {message: 'incorrect user'});
    // }
     done(null, user);
  })
  // var userHere = hashJson.passwords;
  // // console.log(userHere);
  // // console.log(userHere);
  // for (var i =0; i < userHere.length; i++ ) {
  //   if(userHere[i]._id === id) {
  //     var user = userHere[i];
  //     // console.log('user:' + user);
  //     done(null, user);
  //     return;
  //   }
  // }
  // done(null, false);
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE
app.get('/', function(req, res){
  // console.log(req.user)
  if(!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup',
  function(req, res) {
    var newUser = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    newUser.save(function(err, usr){
      if (err) {
        console.log(err)
        res.json({failure: 'database error'})
      } else {
        console.log(usr)
        res.redirect('/');
      }
    });
  });

module.exports = app;
