var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var models = require('./models/models');
var User = require('./models/models').User;

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var userPasswords = require('./passwords.plain.json').passwords;
var hashedUserPasswords = require('./passwords.hashed.json').passwords;

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
// var models = require('./models/models');

// SET UP PASSPORT HERE
app.use(session({
  secret: 'i am a secure cookie',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user){
    if(user){
      done(null, user);
    }
    else{
      done(null,false)
    }
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(user) {
        if(user.password === hashPassword(password)){
          return done(null, user);
        };

        if(user.password !== hashPassword(password)){
          return done(null, false);
        }
      }
      if(err){
        return done(err);
      }
      if(!user) {
        return done(null,false);
      }
    })
  }
));

app.get('/login', function(req, res, next){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
  }) 
);

app.get('/signup', function(req, res, next){
  res.render('signup');
});

app.post('/signup', function(req, res, next){
  var username = req.body.username;
  var password = hashPassword(req.body.password);

  var newUser = new User({
    username: username,
    password: password
  })

  newUser.save(function(err, success){
    if(err){
      res.status(400).send(err);
    } else {
      res.redirect('/login');
    }
  });
});

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
  res.render('index');
});

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
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
