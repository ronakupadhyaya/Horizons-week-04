"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Passwords = require('./passwords.hashed.json').passwords;
var Debugger = require('debug');
var User = require('./models/models').User;

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

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
mongoose.connection.on('connected',function(){
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://user:pass@ds145019.mlab.com:45019/vaultdb')

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'is secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// PASSPORT LOCALSTRATEGY HERE
Passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username}, function(err, user){
      if(user.hashedPassword === hashPassword(password)) {
        done(null,user);
      } else {
        done(null,false);
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
Passport.serializeUser(function(user,done){
  done(null,user._id);
})

Passport.deserializeUser(function(id, done){
  User.findById(id, function(err,user){
    if(err) {
      console.log("deserialize error");
      done(null,false);
    } else {
      console.log("deserialize complete");
      done(null,user)
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(Passport.initialize());
app.use(Passport.session());

// YOUR ROUTES HERE
app.get('/', function(req,res){
  if(req.user) {
  res.render('index', {user: req.user});
} else {
  res.redirect('/login')
}
})

app.get('/login', function(req,res) {
    res.render('login');

})

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup');
})

app.post('/signup',function(req,res){
  console.log(req.body.username)
  if(typeof req.body.password === "string") {
    User.findOne({username: req.body.username}, function(err, user){
      if(!user) {
        var newUser = new User({
          username: req.body.username,
          hashedPassword: hashPassword(req.body.password)
        })
        newUser.save(function(err){
          if(err) console.log('Username not valid');
          res.redirect('/login')
        })
      }
    })
  } else {
    console.log('Username/password not valid')
  }
})

app.post('/login', Passport.authenticate('local', {
  successRedirect: '/',
  failuredRedirect: '/login'
}))


app.listen(3000);
module.exports = app;
