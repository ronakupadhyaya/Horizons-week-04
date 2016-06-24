var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.plain.json').passwords;
// var cookieSession = require('cookie-session');
var session=require('express-session');

var app = express();

// app.use(cookieSession({keys: ['my secret for signing cookies']}))
//var user={};
app.use(session({secret: 'your secret here'}))

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js
var models = require('./models/models');
//var connect= reqquire('./models/connect')

// SET UP PASSPORT HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    console.log(userPasswords.length)
    for(var i=0; i<userPasswords.length; i++){
      if(userPasswords[i].username===username && userPasswords[i].password===password){
        var user=userPasswords[i];
        return done(null, user)
      }
    }
    return done(null, false)
  }))

passport.serializeUser(function(user,done){
  //cookieSession.id=user._id
  done(null, user._id)
})

passport.deserializeUser(function(userid,done){
  for(var i=0; i<userPasswords.length; i++){
    var user=userPasswords[i];
    if(user._id===userid){
      return done(null,user)
    }
  }
})

// app.use(function (req, res, next) {
//   req.sessionOptions.maxAge = 120000;
//   return next()
// })

app.use(passport.initialize());
app.use(passport.session());



app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))

// GET /: This route should only be accessible to logged in users.
app.use('/', function(req, res, next) {
  // Your code here.
  if(!req.user){
    res.redirect('/login')
  }
  else{
    return next()
    //res.render('index')
  }
});


app.get('/', function(req,res){
  res.render('index')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
