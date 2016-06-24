var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
// var userPasswords = require('./passwords.plain.json').passwords;
var users = require('./passwords.hashed.json').passwords;
var LocalStrategy = require('passport-local');
// var cookieSession=require('cookie-session');


var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieSession({keys: ['my secret cookie'], maxAge: 1000*60*2}));
app.use(session({
  secret: 'secret here',
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

app.use(passport.initialize());
app.use(passport.session());


// SET UP PASSPORT HERE

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//   //   for (var user in users) {
//   //     console.log(user.username);
//   //   if ((user.username === username) && (user.password === password)){
//   //     return done (null,user);
//   //   } else {
//   //     return done(null,false);
//   //   }
//   // }
//   var hashedPassword = hashPassword(password)
//   for (var i = 0; i < users.length; i++) {
//       console.log(users.username);
//     if ((users[i].username == username) && (users[i].password == hashedPassword)){
//       return done (null,users[i]);
//     } 
//   }
//     return done(null,false);
//   }
// ));

passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  var hashedddPassword = hashPassword(password)
    models.User.findOne({ username: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) { 
        console.log(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      if (user.hashedPassword !== hashedddPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user,done) {
  done(null, user._id)
});

// passport.deserializeUser(function(id, done) {
//   var user = null;
//   for (var i = 0; i < users.length; i++){
//     if (id == users[i]._id) {
//       user = users[i]
//     }
//   }
//   done(null,user);
// });

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});


  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // GET Login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/signup', function(req, res) {
    // validation step
    var u = new models.User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
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


  // POST Login page
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // GET Logout page
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  app.use(function(req,res,next){
  if(!req.isAuthenticated()) {
    res.redirect('/login')
  } else {
    return next();
  }
})

// GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
  // Your code here.
  res.render('index');
});


// catch 404 and forward to error handler
// instead of doing app.use('/', function(...)
// just delete the '/' so that it works for all pages
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
