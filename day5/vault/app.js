var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var cookieSession = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/models').User

var userPasswords = require('./passwords.hashed.json').passwords;

var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieSession({keys: ['my secret for signing cookies']}));
app.use(session({secret: ['secrets of life'], store: new MongoStore({mongooseConnection: require('mongoose').connection})}));

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
  User.findOne({username: username}, function(err, user) {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false);
    }
    if(user.hashedPassword === hashPassword(password)) {
      return done(null, user);
    }
    return done(null, false);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      return done(err);
    }
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res, next) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
  });

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req,res) {
  var p = new models.User({username: req.body.username,
                hashedPassword: hashPassword(req.body.password)});
  p.save(function(err, User) {
    if(err) {
      res.status(400).send("Error Saving");
    } else {
      res.redirect('/');
    }
  })
})

// wall
app.use(function(req, res, next) {
  if(!req.user) {
    res.redirect('/login');
    return;
  }
  next();
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
