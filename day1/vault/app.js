"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.plain.json');
var models = require('./models/models')

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
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://juliegao:12345@ds133192.mlab.com:33192/passportj')

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({secret:'your secret here'}));

app.use(session({
  secret:'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    var matched = false;
    var foundUser = null
    db.passwords.forEach(function(user) {
      if(hashedPassword === hashPassword(user.password) && username === user.username){
        matched = true;
        foundUser = user;
      }
    });
    if(matched){
      return done(null, foundUser);
    }
    else{
      return done(null, false);
    }
  }));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

// passport.deserializeUser(function(id, done){
//   for(var i =0; i< db.passwords.length; i++){
//     if(id === db.passwords[i]._id){
//       done(null,db.passwords[i]);
//       return
//     }
//   }
//   done(null,false)
// });

var User = require('./models/models').User;
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, foundUser){
    if(err){
      console.log("555");
    }else{
      if(foundUser){
        done(null, foundUser);
      }
    }
  })
})


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/',
  function(req, res) {
    console.log(req.user)
    if(!req.user){
      res.redirect('/login')
    }
    else{
      res.render('index', { user: req.user });
    }
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
  );

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  if(username && password){
    var newUser = new User({username: username, password: hashPassword(password)});
    newUser.save(function(err, savedUser){
      if(err){
        res.status(500);
        console.log("ERROR saving");
      }else{
        res.redirect('/login');
      }
    });
  }
});

module.exports = app;
