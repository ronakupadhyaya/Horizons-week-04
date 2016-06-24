var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var User = require('./models/models').User;



var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({ secret: 'horizonisrad', store: new MongoStore({mongooseConnection: require('mongoose').connection}) }));


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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.hashed.json').passwords;
app.use(passport.initialize());
app.use(passport.session());

// Tell Passport how to set req.user
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }).select('username password').exec(function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) { 
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      return done(null, false);
    }
    console.log("HERE!")
    var validPassword = false;
    var hash = hashPassword(password);
    if(hash === user.password){
      validPassword = true;
    }
    // if passwords do not match, auth failed
    if (!validPassword) {
      return done(null, false);
    }
    // auth has has succeeded
    return done(null, user);
  });
}));

app.get('/login', function(req, res, next) {
  // Your code here.
  res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

app.post('/signup',function(req, res) {
      
  var user = new User();    // create a new instance of the User model
  user.username = req.body.username;  // set the users username (comes from the request)
  var hashsave = hashPassword(req.body.password);
  user.password = hashsave;  // set the users password (comes from the request)
  user.save(function(err) {
    if (err) {
      // duplicate entry
      console.log(err);
      res.render('signup', {error: err});
    }

    // return a message
    res.redirect('login');
  });

})

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

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
