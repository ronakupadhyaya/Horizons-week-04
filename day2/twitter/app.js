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
var mongoose = require('mongoose');

// if (! process.env.MONGODB_URI) {
//   throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
// }
// mongoose.connection.on('connected', function() {
//   console.log('Success: connected to MongoDb!');
// });
// mongoose.connection.on('error', function() {
//   console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
//   process.exit(1);
// });
mongoose.connect(process.env.MONGODB_URI);
app.use(session({
  secret: 'twitter clone',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
// Passport stuff here
app.use(passport.initialize());
app.use(passport.session());
// Session info here
// passport.use(new LocalStrategy(
//   function(username, )
// ))
// Initialize Passport

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(userId, done){
  models.User.findById(userId, function(err, user){
    if(err){
      done(err, null);
    } else{
      done(null, user);
    }
  })
})
// Passport Strategy
passport.use(new LocalStrategy(function(username, password, done){
  console.log("WHERE")
  models.User.findOne({displayName: username}, function(err, user){
    if(err){
      console.log("Err", err);
      return done(err, null);
    }
    if(!user){
      console.log("User", user);
      return done(null, false);
    }
    user.comparePassword(password, function(err, isMatch){
      if(err) throw err;
      if(!isMatch){
        return done(null, false);
      }
      return done(null, user);
    })

  })
}));
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
