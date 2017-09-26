"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json')
// var session = require('cookie-session');
var pwArr = passwords.passwords;
var User = require('./models/models.js')





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
mongoose.connect(process.env.MONGODB_URI)

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'I like puppies',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());


var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

//PASSPORT LOCALSTRATEGY HERE


// passport.use(new LocalStrategy(function(username, password, done){
//   // console.log(username, password)
//   // for (var i = 0; i < pwArr.length; i++ ){
//   //   if(pwArr[i]["username"]===username && pwArr[i]["password"]===hashPassword(password)){
//   //     done(null, pwArr[i]);
//   //     return;
//   //   }
//   // }
//   // done(null, false);
//
// }))
passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({username: username}, function(err, user) {
          if (err) {
              done(err, null);
          } else {
              if (!user) {
                  done(null, false);
              } else {
                var hashedPassword = hashPassword(password);
                  if (hashedPassword === user.password) {
                      done(null, user);
                  } else {
                      done(null, false);
                  }
              }
          }
      })
  }))
//PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  // var user;
  // for (var i = 0; i< pwArr.length;i++){
  //   if(pwArr[i]["_id"]===id){
  //     user = pwArr[i];
  //     done(null, user);
  //     return;
  //   }
  // }
  User.findById(id, function(err,foundUser){
    if(err){
      done(err, null);
    } else {
      if(!foundUser){
        done(null, false);
      } else {
        done(null, foundUser);
      }
    }
  })
})

// PASSPORT MIDDLEWARE HERE
// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user);
  if (!req.user){
    res.redirect('/login')
  }else{
    res.render("index.hbs", {user: req.user});
  }
})


app.get('/login', function(req, res){
  res.render("login.hbs");
})


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup.hbs')
})

app.post('/signup', function(req, res){
  findOne({username: req.body.username}, function(err, user){
    if(err){
      var person = new User {
        username: req.body.username,
        password: hashPassword(req.body.password)
      }
      person.save(function(error){
        if(error){
          res.send(error);
        }
      })
    } else {
      res.redirect('/login')
    }
  })
})

module.exports = app;
