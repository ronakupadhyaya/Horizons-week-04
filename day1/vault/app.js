"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//var passwordDatabase = require('./passwords.plain.json')
//var arrayUsers = passwordDatabase.passwords;
var hashPasswordDatabase = require('./passwords.hashed.json')
var models = require('./models/models')
var User = models.User
var arrayUsers = hashPasswordDatabase.passwords;
//var cookieSession = require('cookie-session');
var expressSession = require('express-session')
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(expressSession)
var validator = require('express-validator')
var crypto = require('crypto')

function hashPassword(password){
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

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
app.use(expressSession({
  secret: 'my secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

//Cookie Session set up
// app.use(cookieSession({
//   keys: ['secretKeys'],
//   maxAge: 10 * 1000
// }))

app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// PASSPORT LOCALSTRATEGY HERE
//var localCheck = function(obj
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user){
      //console.log(user)
      if(user.hashedPassword === hashPassword(password)){
          console.log("correct Login");
          return done(null, user);

      }else{
        console.log('didnt work!')
        return done(null, false)
      }
    })
    // for(var i = 0; i < arrayUsers.length; i++){
    //   var user = arrayUsers[i];
    //   if(user.username === username && user.password === hashPassword(password)){
    //     console.log("correct Login");
    //     return done(null, user);
    //   }
    // }
    // console.log("Wrong Login")
    // return done(null, false, { message: 'Invalid username / password.' })
    }
  ));

/////
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // for(var i = 0; i < arrayUsers.length; i++){
  //     if(arrayUsers[i]._id === id){
  //         var user = arrayUsers[i];
  //         return done(null, user);
  //
  //   }
  // }
  User.findById(id, function(err, user){
    console.log(user);
    return done(null, user)
  })
});

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
//GET login
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login')
  }
  console.log("whole big req", req.session)
  //console.log("whole big req", req.user)
  res.render('index', {
    user: req.user,
  })
})

//GET login
app.get('/login', function(req, res){

  res.render('login')
})
// POST login
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
//GET logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
});

app.get('/signup', function(req, res){
  res.render('signup')
});

app.post('/signup', function(req, res){
  //console.log(req.body)
  var currentUser;
  req.checkBody('username', 'Invalid username').notEmpty();
  req.checkBody('password', 'No password provided').notEmpty();
  var errArray = req.validationErrors();
  //console.log(errArray);
  //console.log(errArray.length)
  if(!errArray){
    console.log('this is working')
     currentUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    })
  }
  currentUser.save(function(err, usr){
    if(err){
      res.json({failure: 'database error'})
    }else{
      //res.json({success:true})
      res.redirect('/login')
    }
  });
  console.log(currentUser)
});

module.exports = app;
