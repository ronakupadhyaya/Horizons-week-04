"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json').passwords; // PART 1.3
// var session = require('cookie-session'); // PART 2.2
var session = require('express-session'); // PART 3.2
var mongoose = require('mongoose'); // PART 3.1
var MongoStore = require('connect-mongo')(session); // PART 3.6
var crypto = require('crypto'); // PART 4.1
var expressValidator = require('express-validator'); // PART 5.3
var User = require('./models/models').User;

// PART 4.1
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator()) // PART 5.3


// MONGODB SETUP HERE
// PART 3.1
mongoose.connection.on('connected', function() {
  console.log('\nConnected to MongoDB\n');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// PART 2.2
app.use(session({
  // keys: ['hello'],
  // maxAge: 1000*60*2,
  secret: ['hello'], // PART 3.3
  store: new MongoStore({mongooseConnection: require('mongoose').connection}) // PART 3.6
}))

// PASSPORT LOCALSTRATEGY HERE
// FIRST LOCALSTRATEGY
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var found = false;
//     passwords.forEach(function(user, index) {
//       if (user.username === username && user.password === password) {
//         found = true;
//         done(null, user);
//       }
//     })
//     if (!found) done(null, null);
//   }
// ))

// PART 4.2
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username, hashedPassword: hashPassword(password),}, function(error, user) {
      if (error) {
        console.log("\n\nEncountered an error searching for user by username: \n", error);
        done(null, null);
      }
      else if (!user) {
        console.log("\n\nNo such user exists: \n", error);
        done(null, null);
      }
      else {
        done(null, user)
      }
    })
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

// PART 1.8
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

// PART 2.3
passport.deserializeUser(function(id, done) {
  console.log('got to deserialize');
  // var found = false;
  // passwords.forEach(function(user, index) {
  //   if (user._id === id) {
  //     found = true;
  //     done(null, user)
  //   }
  // })
  // if (!found) done(null, null)

  // PART 5.4
  User.findById(id, function(error, user) {
    if (error) {
      console.log("\n\nEncountered an error searching for user by id: \n", error);
      done(null, null);
    }
    else if (!user) {
      console.log("\n\nNo such user exists: \n", error);
      done(null, null);
    }
    else {
      done(null, user)
    }
  })
})

// PASSPORT MIDDLEWARE HERE

// PART 1.4
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

// PART 1.5
// app.get('/', function(req, res) {
//   res.render('index');
// })

// PART 2.4
app.get('/', function(req, res) {
  if (req.user) res.render('index', {user: req.user});
  else res.redirect('/login');
})

// PART 1.6
app.get('/login', function(req, res) {
  res.render('login');
})

// PART 1.7
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
})
)

// PART 2.5
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

// PART 5.2
app.get('/signup', function(req, res){
  res.render('signup');
})

// PART 5.3
app.post('/signup', function(req, res){
  req.check('username').notEmpty();
  req.check('password').notEmpty();

  if (req.validationErrors()) {
    console.log("\n\nValidation Errors: ");
    res.status(400).send("Error 400: Bad Request");
    return
  }

  var user = new User({
    username: req.body.username,
    hashedPassword: hashPassword(req.body.password),
  })

  user.save(function(saveError) {
    if (saveError) console.log("\n\nUser save error: \n\n", saveError);
    else {
      res.redirect('/login');
    }
  })
})








module.exports = app;
