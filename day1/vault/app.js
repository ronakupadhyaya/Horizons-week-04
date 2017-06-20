"use strict";

var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passwords = require('./passwords.hashed.json').passwords
var models = require('./models/models')
var User = models.User


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE

mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB')
})
mongoose.connect(
'mongodb://elisenyang:Ddwuud1224@ds133162.mlab.com:33162/vault-elise'
)

// SESSION SETUP HERE
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection
})
}))



// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session())



passport.use(new LocalStrategy(
  function(username, password, done) {
  var hashedPassword = hashPassword(password)
  User.findOne({username: username, password: hashedPassword}, function (err, user) {
    if (err) {
      console.log(err);
      return done(null,false)
    } else if (user) {
      console.log('got valid user', user);
      return done(null,user)
    }
  })

// for (var i=0; i<passwords.length; i++) {
//   var curUser = passwords[i]
//   if(curUser.username === username && curUser.password === hashedPassword) {
//     return done(null, curUser)
//   } else {
//     return done(null, false)
//   }
// }
    }));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  return done(null, user._id);
})

passport.deserializeUser(function (id, done) { //id to user
  var err =''
  User.findById(id, function (err, user) {
    if (err) {
      return done(err,null)
    } else {
      return done(err, user)
    }
  })


//   for(var i=0; i<passwords.length; i++) {
//     var entry= passwords[i]
//     if(entry._id === id) {
//       return done(err, entry)
//     }
//     var err ='could not deserialize user'
//     return done(err, null)
// }
})

// PASSPORT MIDDLEWARE HERE


//PASSWORD HASH
var crypto = require('crypto')
function hashPassword(password) {
  var hash= crypto.createHash('sha256')
  hash.update(password)
  return hash.digest('hex')}


// YOUR ROUTES HERE

app.get('/', function(req,res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {
      user: req.user
      })
    }
  })

app.get('/login', function(req,res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local'), function (req,res){
  res.redirect('/')
})

app.get('/logout', function(req,res) {
  req.logout()
  res.redirect('/')
})

app.get('/signup', function(req,res) {
  res.render('signup')
})

app.post('/signup', function(req,res) {
  if (req.body.username && req.body.password) {
    var newUser = new User ({
      username: req.body.username,
      password: hashPassword(req.body.password)
    })
    newUser.save(function (err) {
      if(!err) {
        res.redirect('/login')
      }
    })
  }
})


module.exports = app;
