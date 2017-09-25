"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Express setup
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var userJson = require('./passwords.hashed.json');
var cookieSession = require('cookie-session');
var session = require('express-session');
var crypto = require('crypto');
var User = require('./models/model').User;
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// MONGODB SETUP HERE
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
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
// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: ["process.env.COOKIE_KEY"]
//   })
// );
app.use(session({
  secret: 'My secret',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(hashPassword(password) === user.hashedPassword){
        done(null, user);
      } else{
        done(null, false);
      }
    })

  }
))
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(userId, done){
  User.findById(userId, function(err, user){
    if(err){
      done(err, null);
    } else{
      done(null, user);
    }
  })
})
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else{
    res.render('index', {user: req.user});
  }

})

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
    if(err){
      res.send(err);
    } else{
      if(!user){
        var newUser = new User({
          username: req.body.username,
          hashedPassword: hashPassword(req.body.password)
        });
        newUser.save(function(err, newUser){
          res.redirect('/login');
        })
      } else{
        res.send("User already exists");
      }
    }
  })
})
app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})
module.exports = app;
