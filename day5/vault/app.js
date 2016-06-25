var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.hashed.json').passwords;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//var cookieSession = require('cookie-session');

var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'hello why am i here help me',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}));
//app.use(cookieSession({keys: ['hello why am i here help me'], maxAge: 1000*60*2}));

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js
var models = require('./models/models');

passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(error, user) {
    if (! user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }
  )
})



// SET UP PASSPORT HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    models.User.findOne({username: username}, function (err, user) {
      console.log('find1');
      if (user.password === hashedPassword) {
          console.log('find2');
        done(null, user);
      } else {
          console.log('find3');
        done(null, false);
      }
    })
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res, next) {
  res.render('login');
})

app.get('/signup', function(req,res,next) {
  res.render('signup');
})

app.post('/signup', function(req, res, next) {
  var u = new models.User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  })
  u.save(function(err, user) {
    if(err) return next(err);
    res.redirect('/login');
  })
})

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}))

app.use(function(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.redirect('/login')
  }
})

// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
  console.log("hit");
  if(req.user) {
    res.render('index')
  } else {
    res.redirect('/login')
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
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
