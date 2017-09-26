var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var models = require('./models/models')
// models.User, Tweet, Follow
var routes = require('./routes/index');
var auth = require('./routes/auth');
var MongoStore = require('connect-mongo/es5')(session);
var mongoose = require('mongoose');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/*    BCRYPT DOCUMENTATION
  Syntax for hashing: bcrypt.hash(plaintext, saltRounds, function(err, hash) {
  // async
  newUser.password = hash;
});

  Syntax for comparing: bcrypt.compare(plaintextTry, hashedPassword, function(err, match) {
  if(match) {
    //login
  } else {
    //incorrect password
  }
});
*/

var app = express();

// DB setup
mongoose.connection.on('connected', function() {
  console.log('Hooked into Twitter mlab database');
});
mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Horizons Twitter'));
app.use(express.static(path.join(__dirname, 'public')));


// Passport stuff here

// Session info here
app.use(session({
  secret: 'Horizons Twitter',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
}));

// Initialize Passport
// Passport Serialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
// Passport Deserialize
passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    if(err) {
      done(err, null);
    } else {
      if(!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    }
  });
});
// Passport Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({email: username}, function(err, user) {
      if(err) {
        done(err, null);
      } else {
        if(!user) {
          done(null, false, { msg: "No user with that e-mail was found."});
        } else {
          bcrypt.compare(password, user.password, function(err, match) {
            if(match) {
              done(null, user);
            } else {
              done(null, false, { msg: "Incorrect password."});
            }
          });
        }
      }
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());
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
