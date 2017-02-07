"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var config = require('./config');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect(config.MONGODB_URI);

//hash function
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};






// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
passport.use(new Strategy(function(username, password, done){
  var hashPass = hashPassword(password);
  // var found = false;
  // (passwords.passwords).forEach(function(user,idx){
  //   if(user.username === username){
  //     console.log(hashPass);
  //     if(user.password === hashPass){
  //       found = true;
  //       done(null, user);
  //     }
  //   }
  // })
  User.findOne({username: username}, function(err,user){
    if(user.password === hashPass){
      done(null,user);
    }else{
      done(null,false);
    }
  })
  // if(!found){
  //   done(null, false);
  // }
}))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // (passwords.passwords).forEach(function(user,idx){
  //   if(user._id === id){
  //     done(null, user);
  //   }
  // })
  console.log("here")
  User.findById(id, function(err, found){
    console.log(id)
    console.log(typeof id)
    if(found){
      done(null,found);
    }
  })






});

// PASSPORT MIDDLEWARE HERE


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login')
  }else{
    res.render('index', {user: req.user});
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

app.get('/signup', function(req,res){
  res.render('signup');
});

app.post('/signup', function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  if(!username || !password){
    console.log(`Whaaaaaaaa invalid shit bruh`)
  }else{
    User.findOne({username: username}, function(err,found){
      if(!found){
        var user = new User(
          {
            username: username,
            password: hashPassword(password)
          }
        );
        user.save(function(err) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.redirect('/login');
          }
        });
      }else{
        console.log(`User exists can't make another account`);
      }
    });
  }
})










module.exports = app;
app.listen(3000);
