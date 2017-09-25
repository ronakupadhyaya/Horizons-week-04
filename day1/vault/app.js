"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.plain.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
console.log(db);
//var mongoose = require('mongoose');
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
// app.use(session({
//   keys: ['a'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret:'a',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    for(var i = 0; i < db.passwords.length; i++){
      if(db.passwords[i].username === username && db.passwords[i].password === password){
        return done(null, db.passwords[i]);
      } //if(db.passwords[i].username === username && db.passwords[i].password !== password){
  }
  return done(null, false);
}
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  var user = {};
  var err = true;
  db.passwords.forEach(function(person){
    if(person._id === id){
      user = person;
      err = null;
    }
  })
    done(err, user);
});
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req);
  if(!req.user){
   res.redirect('/login');
  }else{
    res.render('index',{user: req.user});
  }
})
app.get('/login', function(req, res){
  res.render('login');
})
app.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

module.exports = app;
