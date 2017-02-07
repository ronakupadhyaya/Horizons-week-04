"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose    = require('mongoose');
var config = require('./config');
var cookieSession = require('cookie-session');
var session1 = require('express-session');
var MongoStore = require('connect-mongo')(session1);
var newUser = require('./models/models').newUser;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
mongoose.connect(config.MONGODB_URI);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in config.js');
  process.exit(1);
});

// var passwordsPlain = require('./passwords.plain.json');
var passwordsHash = require('./passwords.hashed.json')

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var user;
//     passwordsPlain.passwords.forEach(function(u, index) {
//       if (u.username === username && u.password === password){
//         return user = passwordsPlain.passwords[index];
//         console.log(user);
//       }
//     })
//     console.log(user);
//     if (user){
//       // if (!user.validPassword(password)) {
//       //   return done(null, false, { message: 'Incorrect password.' });
//       // }
//       return done(null, user);
//     } else {
//         return done(null, false, { message: 'Incorrect username.' });
//     }
//   }
// ));
//
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var user;
//     var hashedPassword = hashPassword(password)
//     passwordsHash.passwords.forEach(function(u, index) {
//       if (u.username === username && u.password === hashedPassword){
//         return user = passwordsHash.passwords[index];
//         console.log(user);
//       }
//     })
//     console.log(user);
//     if (user){
//       // if (!user.validPassword(password)) {
//       //   return done(null, false, { message: 'Incorrect password.' });
//       // }
//       return done(null, user);
//     } else {
//         return done(null, false, { message: 'Incorrect username.' });
//     }
//   }
// ));

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password)
    newUser.findOne({ username: username }, function (err, user) {

      if (err) { return done(err); }
      if (user) {
        if (user.password !== hashedPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect username.' });
    });
  }
));

// SESSION SETUP HERE
// app.use(cookieSession({
//   name: 'session',
//   keys: ['secretKeys'],
//
//   // Cookie Options
//   maxAge: 1000 * 60 * 2// 24 hours
// }))

app.use(session1({
  secret: 'secretHere',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

function hash(password) {
  return hashPassword(password);
}


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
//
//   var user;
//   passwordsPlain.passwords.filter(function(u){
//     if (u._id === id){
//       return user = u;
//     }
//   })
//   console.log(user)
//   if (user.length !== 0) {
//     return done(null, user);
//   } else {
//     return done(null, false)
//   }
// });

passport.deserializeUser(function(id, done) {
  // mongoose.Types.ObjectId.isValid(id);
  newUser.findById(id, function(err, user) {
    if (err) {
      return done (null, false)
    } else {
      return done(null, user);
    }
  });
});


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req,res) {
  console.log(req.user);
  if (!!req.user){
    res.render('index', {user: req.user});
  } else {
    res.redirect('/login')
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function (req, res){
  res.render('signup');
})

function validate(req){
  req.checkBody('password', 'invalid Password').notEmpty();
  req.checkBody('username', 'invalid Password').notEmpty();
}
app.post('/signup', function(req, res){
  // validate(req);

  // var errors = req.validationErrors();
  // if (errors) {
  //   res.send("error")
  // }

  var newU = new newUser ({
    username: req.body.username,
    password: hashPassword(req.body.password)
  })

  newU.save()
  res.redirect('/login');



})

module.exports = app;
