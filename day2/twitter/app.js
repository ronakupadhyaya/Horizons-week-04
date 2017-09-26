var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var models = require('./models/models')
var routes = require('./routes/index');
var auth = require('./routes/auth');
var MongoStore = require('connect-mongo/es5')(session);
var mongoose = require('mongoose');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secretCat'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI);


// Passport stuff here
app.use(session({
  secret: process.env.SECRET,
  name: "Catscookie",
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

passport.use(new LocalStrategy(function(username, password, cb) {
  models.User.findOne({email: username}, function(err, user) {
    if (err) {
      return cb(err);
    }
    else if (!user) {
      return cb(null, false, {message: 'Incorrect username'});
    }
    else if (!password) {
      return cb(null, false, {message: 'Incorrect password'});
    }
    return cb(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  models.User.findById(id, function(err, user) {
    cb(err, user);
  });
});

// Session info here

// Initialize Passport

// Passport Serialize

// Passport Deserialize

// Passport Strategy

app.use('/', auth(passport));
app.use('/', routes);

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
