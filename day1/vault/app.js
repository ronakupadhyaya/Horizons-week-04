"use strict";
console.log('hi')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var readJson = require('./passwords.hashed.json')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto')


var models = require('./models/models')
var User = models.User

// var mongoose = require('mongoose')

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//cookies

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Connected to MONGODB')
})
mongoose.connect('mongodb://newuser:horizons@ds133162.mlab.com:33162/vaultcarlie');
// SESSION SETUP HERE

// app.use(session({
//   keys: ['hi my name carlie'],
//   maxAge: 1000*60*10
// }))
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password)
    User.findOne({username: username, password: hashedPassword}, function(err, user) {
      if(err) {
        console.log(err)
        done(null, user)
      } else if(user){
        console.log('got valid user', user)
        return done(null, false)
      }
    })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE //process of tokenizing the user

passport.serializeUser(function(user, done){
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if(!req.user) {
    res.redirect('/login')
  }
  else {
    res.render('index', {
      user: req.user
    })
  }
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', function(req, res){
  res.redirect('/')
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/signup', function(req, res) {
  if(req.body.username && req.body.password) {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    newUser.save(function(err, user) {
      if(err) {
        console.log(err)
      }
      else {
        console.log('saved!')
        res.redirect('/login')
      }
    })
  }
})
//passport.authenticate middleware gets called whcih checks username and passwords
//the checking is done in LocalStrategy
//if successful from localstrategy, call passport.serialize
//passport.serialize adds an id into the browser cookie
//some time passes
//new requrest from user such as GET REQUEST /
//passport checks if theres a cookie on the request and parses our token
//if there is a,v a valid user id or some token, call passport.deserializeUser
//if deserializeUser gives back a user, put that in req.user
//if deserializeUser is successful, put the extracted user in req.user
//deserialize: going from cookie to user

//ORDER: session middleware before passport.session()

module.exports = app;
