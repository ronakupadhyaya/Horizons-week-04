var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Passport set-up
var userPasswords = require('./passwords.hashed.json').passwords;
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

// cookies 
// var cookieSession = require('cookie-session');
// app.use(cookieSession({keys: ['secret'], maxAge:1000*60*2}));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session( {
  secret: 'secret',
store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // userPasswords.forEach(function(user) {
  //   if (user._id === id) {
  //     done(null, user);
  //   }
  // })f

  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Models are defined in models/models.js
var models = require('./models/models');

// SET UP PASSPORT HERE
passport.use(new LocalStrategy (
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (user.password === password) {
        done(null, user);
      }
      else {
        done(null,false);
      }
    })
    // var hashedPassword = hashPassword(password);
    
    // userPasswords.forEach(function(user) {

    //   if (user.username === username && user.password === hashedPassword) {
    //     u = user;
    //   }
    // });
    // return done(null, u);


    // var u = false;
    // userPasswords.forEach(function(user) {

    //   if (user.username === username && user.password === password) {
    //     u = user;
    //   }
    // });
    // return done(null, u);
}));

app.get('/signup', function(req, res, next) {
    res.render('register');
    });

    app.post('/signup', function(req, res, next) {

      var username = req.body.username;
      var password = req.body.password;
      

      // can also make sure that fields aren't empty

      // check if password fields are equivalent, then allow user to register and redirect to login page
      
        user = new User ({
          username: username,
          password: password
        });

        user.save(function(err) {
          if (err) {
            console.log('error registering');
          }
          else {
            res.redirect('login');
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

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res) {
 if (!req.isAuthenticated()) {
   res.render('index');
 }
 else {
  res.redirect('/login');
 }
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
