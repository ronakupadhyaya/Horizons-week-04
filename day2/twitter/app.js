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
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var app = express();

var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

var connectInfo = process.env.MONGODB_URI
mongoose.connect(connectInfo)


// Passport stuff here

// Session info here
app.use(session({
  secret: process.env.SECRET,
  name: 'Catscoookie',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialize
passport.serializeUser(function (user, done) {
  done(null, user._id)
})

// Passport Deserialize
passport.deserializeUser(function (id, done) {
  User.findById(id, function (error, user) {
    done(error, user);
  })
})

// Passport Strategy
passport.use(new LocalStrategy(function (email, password, done) {
  User.findOne({
    email: email
  }, function (error, user) {
    if (error) {
      console.error(error);
    }
    if (!user) {
      console.log(user);
      return done(null, false, {
        message: 'Incorrect Email'
      })
    }
    if (user.password !== password) {
      return done(null, false, {
        message: 'Incorrect Password'
      })
    }
    return done(null, user)
  })
}))

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
