"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var config = require('./config');
var cookiesession = require('cookie-session');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connect(config.MONGODB_URI);
mongoose.connection.on('connected', function(){
	console.log('successfully connected')
});


// SESSION SETUP HERE
app.use(passport.initialize());
app.use(passport.session());
app.use(cookiesession({
 keys: ['my very secret password'],
   maxAge: 1000*60*2
 }));
// var router = express.Router();
// PASSPORT LOCALSTRATEGY HERE

var passwordplain = require('./passwords.plain.json');
passport.use(new LocalStrategy(function(username, password, done) {
    var user;
    passwordplain.passwords.forEach(function(item){
      if(item.username === username && item.password === password){
        return user = passwordplain
      }
    })
    if(!found){
      console.log("Failed");
      return done(null, false);
    }
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(_id, function(err,user){
    done(err,user);
  })
})



// var passwordhash = require('./passwords.hashed.json');
//
// passport.use(new LocalStrategy(
//
//   function(username, password, done) {
//     passwordhash.forEach(function(item){
//       if(item.username === username && item.password === password){
//         res.send("Login Successful")
//       } else{
//         res.send('Incorrect password or username');
//       }
//       return done(null, user);
//     });
//   }
// ));



// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

app.get('/', function(req,res){
  if(!!req.user){
    res.render('index', {user: req.user});
  } else {
        res.redirect('/login');
  }



});

app.get('/login', function(req,res){
  res.render('login');
  // if(req.user === ){
  //
  // }
});

app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
//   function(req,res){
//     res.redirect('/');
}));



// app.listen(3000);
module.exports = app;
