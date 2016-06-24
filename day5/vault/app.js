var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.hashed.json').passwords;
//express session gives you more control than cookiesession
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var models = require('./models/models');
var User = models.User;

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}));


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
passport.use(new LocalStrategy(
  function(username, password, done) {
    // for (var i = 0; i < userPasswords.length; i++) {
    //   if (username === userPasswords[i].username) {

    //     if (hashPassword(password) === userPasswords[i].password) {
    //       return done(null, userPasswords[i]);

    //     }
    //   }
    // }

    User.findOne({username: username}, function(error, user) {
    if (error) {
      return done(null, false, error)
    } else {
      if(user.password = hashPassword(password))
      return done(null, user);
    }
    });
  }
));

// turn something into the format you store it as
passport.serializeUser(function(user, done) {

  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  // for (var i = 0; i < userPasswords.length; i++) {
  //     if (id === userPasswords[i]._id) {
  //       done(null, userPasswords[i]);
  //     }
  // }

  User.findById(id, function(error, user) {
    if (error) {
      done(null, false, error)
    } else {
      done(null, user);
    }
  })
})

app.use(passport.initialize());
// cookie has to be available for setting before update

app.use(passport.session());

// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res) {
  // Your code here.
  // use req.user for passport.session
  if(!req.user) {
    res.redirect('/login');
  }
  else {
  res.render('index');
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
})

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  var hashedPassword = hashPassword(req.body.password);
  var newUser = new User({username: req.body.username, hashedPassword});
  newUser.save(function(error) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.redirect('/login');
    }
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

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
