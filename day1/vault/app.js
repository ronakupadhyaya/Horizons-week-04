"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var _ = require('underscore');
var models = require('./models/models.js');
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
mongoose.connect('mongodb://moose:redhat@ds131432.mlab.com:31432/vault-exercise');
// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'austinlikeswaffles',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// var session = require('cookie-session');
// app.use(session({
//   keys: ['austinlikeswaffles'],
//   maxAge: 1000*10
// }));

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
var passwordList = require('./passwords.plain.json');
var passwordList2 = require('./passwords.hashed.json');
passport.use(new LocalStrategy(
  function(username, password, done) {
    // console.log('hi');
    var hashed = hashPassword(password);
    models.User.findOne({username: username}, function(err, user){
      if (err || !user) {
        done(null, false);
      } else {
        if (user.hashedPassword === hashed){
          // console.log(password +' passed');

          done(null, user);
        } else {
          // console.log(password +' failed');
          // console.log(user);

          done(null, false);
        }
      }
    });
  }

  // function(username, password, done) {
  //   var passList2 = passwordList2.passwords;
  //   var hashedPassword = hashPassword(password);
  //   for (var i = 0; i < passList2.length; i++) {
  //     if (passList2[i].password === hashedPassword && passList2[i].username === username){
  //       done(null, passList2[i]);
  //       return;
  //     }
  //   }
  //   done(null, false);
  // }
  // function(username, password, done) {
  //   var passList = passwordList.passwords;
  //   for (var i = 0; i < passList.length; i++) {
  //     if(passList[i].username === username && passList[i].password === password){
  //       done(null, passList[i]);
  //       return;
  //     }
  //   }
  //   done(null, false);
  // }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  models.User.findById(id, function(err, found){
    if(err){
      res.send("error: id not found");
    } else {
      done(null, found);
    }
  })

  // var passList = passwordList.passwords
  // for (var i = 0; i < passList.length; i++) {
  //   if(passList[i]._id === id){
  //     thisUser = passList[i];
  //   }
  // }
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else {
    res.render('index', {
      user: req.user
    });
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  var usernameInput = req.body.username;
  var passwordInput = req.body.password;
  var hashed = hashPassword(passwordInput);
  if(!usernameInput){
    res.send('error: username cannot be empty');
    return;
  }
  if(!passwordInput){
    res.send('error: password cannot be empty');
    return;
  }
  models.User.findOne({username: usernameInput}, function(err, found){
    console.log(err);
    console.log(found);
    if(found){
      res.send('error: Username already exists');
    } else {
      var newUser = new models.User({username: usernameInput, hashedPassword: hashed});
      newUser.save(function(err, user){
        if(err){
          res.json({failure: "database error"});
        } else {
          // res.json({success: true});
          res.redirect('/login');
        }
      })
    }
  });

});


module.exports = app;
