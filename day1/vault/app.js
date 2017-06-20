"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var login = require('./passwords.plain.json');
var loginHash = require('./passwords.hashed.json');

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
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb')
});
mongoose.connect('mongodb://ebadgio:abcD1996@ds131512.mlab.com:31512/vault')

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret:'my secret',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashed = hashPassword(password);
    User.findOne({username:username}, function(err, user) {
      if(err){
        console.log('error')
      }
      else if(!user){
        return done(null, false, { message: 'Incorrect username.' });
      }
      else{
        if(user.password === hashed){
          return done(null, user);
        }
        else{
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
    });
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id,done){
  User.findById(id, function(err,user){
    if(err){
      console.log(err);
      console.log('here','Error')
    }
    else{
      if(user){
        done(null,user);
      }
      else{
        console.log('Couldnt find user.');
      }
    }
  });
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req,res){
  console.log(req.user);
  if (!req.user){
    res.redirect('/login');
  }
  else{
    res.render('index',{
      user:req.user
    })
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

app.get('/signup', function(req,res){
  res.render('signup')
});


app.post('/signup', function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username, password);
  if(username && password){
    console.log('here');
    var user = new User({
      username:username,
      password:hashPassword(password)
    });
    user.save(function(err){
      if (err) {
        console.log('err')
      } else {
        console.log('made it');
        res.redirect('/login')
      }
    })
  }
});

module.exports = app;


