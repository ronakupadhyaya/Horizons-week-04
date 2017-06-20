"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passwords = require('./passwords.hashed.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models');
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
  console.log('Connected to MongoDB');
});
mongoose.connect('mongodb://user:user@ds061248.mlab.com:61248/vault');


// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: "this is a secret",
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    if(!username){
      return done(null, false, { message: 'Please enter username.' });
    } else if(!password){
      return done(null, false, { message: 'Please enter password.' });
    }
    // for(var i = 0; i < passwords.passwords.length; i++){
    //   var user = passwords.passwords[i];
    //   var hashedPassword = hashPassword(password);
    //   if(user.username === username && user.password === hashedPassword){
    //     console.log(user);
    //     return done (null, user);
    //   }
    // };
    console.log(username, hashPassword(password));
    models.User.findOne({username: username}, function(error, user){
      console.log(user);
      if(user && user.hashedPassword === hashPassword(password)){
        return done(null, user);
      }
      return done(null, false, {message: 'Invalid username/password combination'});
    });


  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  console.log('serializeUser')
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  console.log('deserializeUser')
  // for(var i = 0; i < passwords.passwords.length; i++){
  //   var user = passwords.passwords[i];
  //   if(user._id === id){
  //     done(null, user);
  //   }
  // };
  models.User.findById(id, function(err, user){
    if(err){
      console.log("User not found.")
    }
    else{
      done(null, user);
    }
  })
})

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
//console.log(req)
if(req.user){
  console.log('success');
  res.render('index', {
    user: req.user
  });
}
else{
  console.log('failure');
  res.redirect('/login');
}

});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
  var found = false;
  for(var i = 0; i < passwords.passwords.length; i++){
    var user = passwords.passwords[i];
    if(user.username === req.body.username){
      found = true;
    }
  };
  if(!found){
    var newUser = new models.User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    newUser.save();
    res.redirect('/login');
  }
  else{
    console.log("Username exists");
  }
});

module.exports = app;
