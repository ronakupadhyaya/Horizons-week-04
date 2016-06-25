var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');                              // what i added
var LocalStrategy = require('passport-local').Strategy;          // what i added
var userPasswords = require('./passwords.hashed.json').passwords;  // what i added
var models = require('./models/models');
var session = require('express-session');                    // what i added
var MongoStore = require('connect-mongo')(session);
var User = require('./models/models').User;


var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret', store: new MongoStore({mongooseConnection: require('mongoose').connection})}));// what i added


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
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  // for (var i = 0; i < userPasswords.length; i ++) {
  //   if (id === userPasswords[i]._id) {
  //     var user = userPasswords[i];
  //   }
  // }
  User.findById(id, function(error, user) {
    if (error) {
      done(error, null);
    }
    done(null, user);
  })
})

passport.use(new LocalStrategy(function(username, password, done) {
  var hashedPassword = hashPassword(password);
  // for (var i = 0; i < userPasswords.length; i ++) {
  //   var user = userPasswords[i]
  User.findOne({username: username}, function(error, user) {
    console.log(user, hashedPassword);
    if (user.password === hashedPassword) {
      return done(null, user);
    }
    done(null, false);
  })
  //   if (userPasswords[i].username === username && userPasswords[i].password === hashedPassword) {
  //     return done(null, user);
  //   } 
  // }
}))

// GET /: This route should only be accessible to logged in users.
app.get('/login', function(req, res, next) {
  if (req.user) {
    res.redirect('/');
  }
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/signup', function(req, res, next) {
  res.render('signup');
})

app.post('/signup', function(req, res, next) {
  var u = new User({username: req.body.username, password: hashPassword(req.body.password)});
  u.save(function(error, user) {
    if (error) {
      res.status(500).send('error');
    } else {
      res.redirect('/login');
    }
  })
})

app.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login')
  }
  next();
})

app.get('/', function(req, res, next) {
  // Your code here.
  res.render('index');
});

app.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/')
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
