var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.hashed.json').passwords;
var session = require('express-session');
var models = require('./models/models');
var mongoStore = require('connect-mongo')(session);


var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "super secrets",
  store: new mongoStore({mongooseConnection: require('mongoose').connection})
}));

app.use(passport.initialize());
app.use(passport.session());


// app.use(router);

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js



// SET UP PASSPORT HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPass = hashPassword(password);
      models.User.findOne({username: username}, function(err, user) {
      if(err) {
        return done(null, err);
      }
      if (user && user.hashedPassword === hashedPass) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var hashedPassword = hashPassword(req.body.password);

  var newUser = new models.User ({
    username: username,
    hashedPassword: hashedPassword
  });

  newUser.save(function(err, success){
    if(err) {
      res.status(400).send(err);
    } else {
      res.redirect('/login');
    }
  })
});


//authenticate below
app.use(function(req, res, next) {
  if(!req.user) {
    console.log('not logged in');
    res.redirect('/login');
  } else {
    next();
  }
});

// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
  // Your code here.
    res.render('index');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.render('login');
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
