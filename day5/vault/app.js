var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var userPasswords = require('./passwords.hashed.json').passwords;
var session = require('express-session');
var cookieSession = require('cookie-session');
var MongoStore = require('connect-mongo')(session);
var model = require('./models/models');
var User = model.User;


var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Passport Setup

app.use(session({
    secret: "secret",
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser(function(user, done) {
  console.log("serialize");
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    return done(null, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(user.password === password){
        return done(null, user);
      }else{
        return done(null, false);
      }
    })
  }
));

function check(req, res, next){
  if(req.isAuthenticated()){
    console.log("authenticated");
    return next();
  }else{
    console.log("not authenticated");
    res.redirect('/login');
  }
}

// GET /: This route should only be accessible to logged in users.

app.get('/', function(req, res, next) {
  console.log("checking");
  // Your code here.
  res.render('index');
  // res.send('ok');
});


app.get('/login', function(req, res, next){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/login');
});

app.get('/signup', function(req, res, next){
  res.render('signup');
});

app.post('/signup', function(req, res, next){
  console.log('got page');
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
    }
  })
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
