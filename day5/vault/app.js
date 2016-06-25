var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.plain.json').passwords;

var app = express();

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

// SET UP PASSPORT HERE
passport.use(LocalStrategy(
  function(username, password, done) {
    for(var i = 0; i < userPasswords.length; i++){
      if(username === userPasswords[i].username &&
         password === userPasswords[i].password){
        done(null, userPasswords[i]);
      }
    }
    done(null, false);
  }
));

app.use(passport.initialize());
app.use(passport.session());

//login routes
app.get('/login', function(req, res, next){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

//check if logged in
router.use(function(req, res, next){
        if(req.user){
            res.redirect('/contacts');
        } else {
            res.redirect('/login');
        }
    });

// GET /: This route should only be accessible to logged in users.
router.get('/', function(req, res, next) {
  // Your code here.
  res.render('index');
});


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
