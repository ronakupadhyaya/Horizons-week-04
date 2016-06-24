var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var userPasswords = require('./passwords.hashed.json').passwords;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// Express setup
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));1
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
passport.use(new LocalStrategy(function(username, password, done) {
  var password2 = hashPassword(password);
  models.User.findOne({username: username}, function(err, user){
    if(user.password !== password2){
      return done(null, false);
    }
    else
    {
      return done(null, user);
    }
  })
}));

passport.serializeUser(function(user, done){
  return done(null, user._id);
})

passport.deserializeUser(function(id, done){
  models.User.findById(id, function(err, user) {
    if(err)
    {
      return done(null, false);
    }
      else{
        return done(null, user);
      }
  })
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
if(!req.body.username || !req.body.password)
  {
    res.render('signup', {
    error: 'Missing user fields'
    });
  }
  else
  {
    var u = models.User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      });
    u.save(function(error){
        if(error){
          res.render('signup', {
           error: error
          })
        } else {
          res.redirect('/login');
        }
      })
  }
})

app.use(function(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }
    else{
      next();
    }
})
// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
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
