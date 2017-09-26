"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordsHashed = require('./passwords.hashed.json');
// var session = require('cookie-session');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
var User = require('./models/models')
var expressValidator = require('express-validator');
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('connected to MONGOD');
})
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
app.use(session({
  secret: 'the sauce is tangy',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// app.use(session({
//   keys: ['mypassword'],
//   maxAge: 1000*60*2
// }))
// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    // var bool = false;
    var hashedPassword = hashPassword(password);
    // passwordsHashed.passwords.forEach(function(item){
    //   if(item.username === username && item.password === hashedPassword){
    //     bool = true;
    //     done(null, item);
    //   }
    // })
    // if (!bool) {
    //   done(null, false);
    // }
    User.findOne({username: username}, function (error, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (error) {
        console.error(error, "error");
        return done(error);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, {message: 'username does not exist.'});
      }
      // if passwords do not match, auth failed
      if (user.password !== hashedPassword) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
//   passwordsHashed.passwords.forEach(function(item){
//     if(id === item._id){
//       done(null, item);
//     }
//   });
// });
  User.findById(id, function(error, user){
    if(error){
      console.log("error", id);
    } else{
      done(null, user);
    }
  })
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {user: req.user});
  } else {
    res.redirect('login');
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
  req.check('username', 'blank username').notEmpty();
  req.check('password', 'blank password').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('signup', {
      errors: errors
    });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    newUser.save({}, function(error){
      if (error) {
        console.log("error", error);
      } else {
        res.redirect('login');
      }
    })
  }
})

app.listen(3000);


module.exports = app;
