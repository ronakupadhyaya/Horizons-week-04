"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var cookieSession = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;

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
  console.log('Connected to database.');
});
mongoose.connect('mongodb://toddallen115:password@ds025379.mlab.com:25379/toddvault');

// SESSION SETUP HERE
// app.use(cookieSession({
//   keys: ['keyboard cat'],
//   maxAge: 1000*60*10
// }));
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false
}));

// PASSPORT LOCALSTRATEGY HERE

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

var plainPasswords = require('./passwords.plain.json');
var hashedPasswords = require('./passwords.hashed.json');

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(hashPassword(password) === user.password){
        done(null, user);
      }else{
        done(null, false);
      }
    });
  }
));
  // function(username, password, done) {
  //   console.log("local strat running");
  //   var pass = false;
  //   var user;
  //   var hashed = hashPassword(password);
  //   hashedPasswords.passwords.forEach(function(item){
  //     if(username === item.username && hashed === item.password){
  //       pass = true;
  //       user = item;
  //     };
  //   });
  //   if (pass) {
  //     //login
  //     done(null, user);
  //   }
  //   else{
  //     //refuse
  //     done(null, false);
  //   }
  // })


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){

  User.findById(id, function(err, user){
    if(err){
      console.log(err);
    }else{
      done(null, user);
    }
  });

});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());



// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(req.user){
    res.render('index', {user: req.user});
  }else{
    res.redirect('/login');
  }

})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  })

  app.get('/signup', function(req, res){
    res.render('signup');
  })

  app.post('/signup', function(req, res){
    if(req.body.username.length === 0 || req.body.password.length === 0){
      console.log('please fill all fields.');
    }else{

      var newUser = new User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      });

      newUser.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect('/login');
        }
      });

    }
  })

module.exports = app;
