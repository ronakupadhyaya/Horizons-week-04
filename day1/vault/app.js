"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passwordDB = require('./passwords.plain.json');
var passwordDBHashed = require('./passwords.hashed.json');
var mongoose = require('mongoose');

var User = require("./models/models.js").User;


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session());

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log("Connected to MongoDB!");
});
mongoose.connect("mongodb://syoun:youn0620@ds131492.mlab.com:31492/login-user");

// SESSION SETUP HERE PART2
// var session = require('cookie-session'); this is not secure
//
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }))

//Session with MongoDB (more secure)
// Verify that your sessions don't die by logging in and restarting node.
// You should stay logged in!
// You should now see a new Collection in mLab names sessions.
// This is where your sessions are stored now.
// Try deleting these and see if you get logged out as a result.

var session = require('express-session');
var MongoStore =require('connect-mongo')(session)

app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// PASSPORT LOCALSTRATEGY HERE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done){
  //   if (username && password) {
  //     var hashedPassword = hashPassword(password);
  //     for (var i = 0; i<passwordDBHashed.passwords.length; i++){
  //       if (username === passwordDBHashed.passwords[i].username &&
  //       hashedPassword === passwordDBHashed.passwords[i].password){
  //         var user = passwordDBHashed.passwords[i];
  //         break;
  //       }
  //     }
  //   }
  //   if (user !== null){
  //     done(null,user);
  //   }
  //   else {
  //     done(null, false);
  //   }


  //updated
  User.findOne({username:username}, function(err, user){
    if (password === user.password){
      done(null, user);
    }
    else{
      done(null, false);
    }
  })


  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id); //we use the user._id to represent the user in the session.
})
passport.deserializeUser(function(id, done){
  // var user = null;
  // for (var i = 0; i<passwordDB.passwords.length; i++){
  //   if (id === passwordDB.passwords[i]._id){
  //     user = passwordDB.passwords[i];
  //     break;
  //   }
  // }
  //
  // done(null, user);

  //updated one
  User.findById(id, function(error, userObj){
    if (error){
      console.log(error);
      done(null, null);
    }
    else{
      done(null, userObj);
    }
  })
})

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function (req, res) {
  //console.log(req.user);
  if (!req.user){
    res.redirect('/login');
  }
  else{
    res.render("index", {
      user:req.user
    })
  }
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/login', function (req, res) {
  res.render("login")
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/signup', function(req, res){
  res.render("signup.hbs")
})

app.post('/signup', function(req, res){
  if (req.body.username && req.body.password){
    var hashedOne = hashPassword(req.body.password);
    var newUser = new User({
      username: req.body.username,
      hashedpassword: hashedOne
    })
    newUser.save(function(err, user){
      if (err){
        console.log(err);
      }
      else{
        res.redirect('/login');
      }
    })
  }
})

// Hashing
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
//console.log(hashPassword("middl3ware"));


module.exports = app;
