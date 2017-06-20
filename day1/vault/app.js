"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var User = require("./models/models").User;




// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
// require the mongoose package
var mongoose = require('mongoose');
mongoose.connection.on('connected',function(){
  console.log('Connected to MongoDb!');
})

mongoose.connect('mongodb://marinabacha:123@ds131492.mlab.com:31492/vault_day1')

// SESSION SETUP HERE (cookies???)
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: "this secret",
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}



// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

var readJson = require('./passwords.hashed.json')

//var hashedP = hashPassword(password)

passport.use(new LocalStrategy(
  function(username, password, done) {

    var hashedPassword = hashPassword(password)
    User.findOne({username: username, password: hashedPassword}, function (err, user) {
      if (err) {
        console.log(err);
        return done(err)
      } else if (user) {
        console.log('got valid user', user);
        return done(null,user)
      }else{
        return done(null, false)
      }
    })
  }));

  // PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // PASSPORT MIDDLEWARE HERE

  // app.configure(function() {
  //   app.use(express.static('public'));
  //   app.use(express.cookieParser());
  //   app.use(express.bodyParser());
  //   app.use(express.session({ secret: 'keyboard cat' }));
  //   app.use(passport.initialize());
  //   app.use(passport.session());
  //   app.use(app.router);
  // });

  // YOUR ROUTES HERE

  app.get('/', function(req, res) {
    if(req.user){
      res.render('index', {user: req.user});
    }else{
      res.redirect('/login');
    }
  })

  app.get('/login', function(req, res) {
    res.render('login')
  })

  app.post('/login', passport.authenticate('local'),function(req,res){
    console.log('here')
    res.redirect('/')

  })

  app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
  });


  app.get('/signup', function(req,res){
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

  // Login scenario
  //Go to login//Post for (username, password)
  //passport.authenticate middleware gets called, which checks username and passowrd
  //the checking is done in our LOCALSTRATEGY
  //if successful from localstrategy, call passport.serialize
  //passport.serialize adds an id (or some token) into browser cookie
  //some time passes
  //new request from user (such as get requres/)
  // passport checks if theres a cookie on the request and parses our token
  //if there is, a valid user id or some token, call passport.deserializeUser
  //if deserializeUser gives back a user, put that it req.user
  //if deserializeUser is successful, put the extracted user in req.user


  //ODER
  //session middleware should come before passport.session
