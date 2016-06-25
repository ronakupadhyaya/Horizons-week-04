var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var userPasswords = require('./passwords.plain.json').passwords;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// Express setup
// var cookieSession = require('cookie-session');
// app.use(cookieSession({keys: ['my secret for signing cookies'], maxAge:1000*60*2}));
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'your secret here', store: new MongoStore({mongooseConnection: require('mongoose').connection})}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
// passport.use(new LocalStrategy(function(username, password, done) {
//   for(var i = 0; i < userPasswords.length; i++)
//   {
//     if (username === userPasswords[i].username && password === userPasswords[i].password) {
//       return done(null, userPasswords[i]);
//     }
//   }
//     return done(null, false);
// }));

//       // if there's an error, finish trying to authenticate (auth failed)
//       if (err) {
//         console.error(err);
//         return done(err);
//       }
//       // if no user present, auth failed
//       if (!user) {
//         console.log(user);
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       // if passwords do not match, auth failed
//       if (user.password !== password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       // auth has has succeeded
//       return done(null, user);
//     });
//   }
// ));


passport.use(new LocalStrategy(function(username, password, done) {
  var hashed = hashPassword(password);
  models.User.findOne({username: username}, function(err, user){
    if(user.password === hashed){
      done(null, user)
    }else {
      done(null, false);
    }
  });
}));

//hashed passwords
// var hashed = require('./passwords.hashed.json').passwords;
//
// passport.use(new LocalStrategy(function(username, hashed, done) {
//   var hashed = hashPassword(password);
//   for(var i = 0; i < hashPasswords.length; i++)
//   {
//     if (username === hashPasswords[i].username && hashed === hashPasswords[i].password) {
//       return done(null, hashPasswords[i]);
//     }
//   }
//     return done(null, false);
// }));

passport.serializeUser(function(user, done){
  return done(null, user._id);
})

// passport.deserializeUser(function(id, done){
// var user = false;
// for(var i = 0; i < userPasswords.length; i++)
//   {
//     if (id === userPasswords[i]._id) {
//       user = userPasswords[i];
//     }
//   }
//   return done(null, user);
// })

passport.deserializeUser(function(id, done){
  models.User.findById(id, function(err, user){
    done(err, user);
  });
});

app.get('/login', function(req, res, next){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res){
  var u = new models.User({
    username: req.body.username,
    // hashed: hashPassword(req.body.password)
    password: hashPassword(req.body.password)
  });
  u.save(function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).redirect('/signup');
      return;
    }
    console.log(user);
    res.redirect('/login');
  });
});

app.use(function(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }
    else{
      next();
    }
});
// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
  // Your code here.
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
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
};

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
