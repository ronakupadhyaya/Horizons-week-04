"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
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
mongoose.connection.on('error', function(){
  console.log('Oh noooo! Could not connect to database')
})
mongoose.connection.on('connected', function(){
  console.log('Yayyy! Connected to database')
})
mongoose.connect('mongodb://myUser:123@ds115411.mlab.com:15411/vault-d');

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'tis a secret', //Specifying how long a cookie should last
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
var db = require('./passwords.hashed.json');

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    models.User.findOne({username: username}, function(err, user) {
      if (hashedPassword===user.password) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
    // var hashedPassword = hashPassword(password);
    // var matched = false;
    // var foundUser = {}
    // db.passwords.forEach(function(user){
    //   if(username===user.username && hashedPassword===user.password) {
    //     matched = true;
    //     foundUser = user;
    //   }
    // })
    // if (matched) {done(null, foundUser);}
    // else {done(null, false);}
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // for(var i=0; i<db.passwords.length; i++) {
  //   if(id===db.passwords[i]._id) {
  //     done(null, db.passwords[i]);
  //     return;
  //   }
  // }
  // done(null, false)
  models.User.findById(id, function(err, user){
    if (err) {return done(err);}
    done(null, user)
  })
});

// PASSPORT MIDDLEWARE HERE
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/',
  function(req, res) {
    if(!req.user){res.redirect('/login');}
    else {res.render('index', { user: req.user });}
  }
);

app.get('/login',
  function(req, res) {
    res.render('login');
  }
);

app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);

app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  }
);

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

app.get('/signup',
  function(req, res) {
    res.render('signup');
  }
);

app.post('/signup',
  function(req, res) {
    if (req.body.username && req.body.password) {
      var newUser = new models.User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      })
      newUser.save(function(err){
        if(err){
          var error = "Something is wrong"
          res.render('signup', {
            error: error
          })
        } else {
          res.redirect('/login')
        }
      });
    } else {
      var error = "Username and password cannot be empty"
      res.render('signup', {
        error: error
      })
    }
  }
);


// Login Scenario

// ORDER:
// session middleware should come before passport.session()

// Go to Login
// POST form (username, password)
// passport.authenticate middleware gets called, which checks username and password
// the checking is done in our LOCALSTRATEGY for a matching user object
// If successful from LOCALSTRATEGY, call passport.serialize with user object
// passport.serialize adds an id (or some token) into browser cookie associated with user object

// some time passes...

// new request from user (such as GET REQUEST /)
// passport checks if there's a cookie on the request, and parses the token associated with user
// if there is, a valid user id (or some token), call passport.deserializeUser to go from id back to original user object
// if deserializeUser gives back a valid user, put that in req.user!!

// repeat: if deserializeUser is successful, put the extracted user in req.user!!
//
// use req.user from now on to authenticate user!!



module.exports = app;
