"use strict";

var express = require('express');
var expressHandlebars = require('express-handlebars')
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var passwordsPlain = require('./passwords.plain.json').passwords;
var passwordsHashed = require('./passwords.hashed.json').passwords;
var cookieSession = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var models = require('./models/models');
var User = models.User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!')
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(cookieSession({
//   keys: ["secret password"],
//   maxAge: 1000*60*2
// }))

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

app.use(session({
  secret: 'secret password',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// PASSPORT LOCALSTRATEGY HERE
var LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err,user) {
      if(user && user.hashedpassword === hashPassword(password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(passwords, done) {
  done(null, passwords._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, user) {
    if(error) {
      done(null, false);
      return;
    }
      done(null, user);
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session())

// YOUR ROUTES HERE
app.get('/', function(req,res) {
  if(!req.user) {
    res.redirect('/login')
  } else {
  res.render('index', {
    user: req.user
///^ THATS WHERE U DEFINE IT
  })
  }
})

app.get('/login', function(req,res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
  })
)

app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/')
});

app.get('/signup', function(req,res) {
  res.render('signup')
});

app.post('/signup', function(req,res) {
  req.checkBody('username', 'inputted username is empty').notEmpty();
  req.checkBody('password', 'inputted password is empty').notEmpty();

  var error = req.validationErrors();
  if(error) {
    res.send('u missing something')
  } else {
    var newUser = new User ({
      username: req.body.username,
      hashedpassword: hashPassword(req.body.password)
    });

    newUser.save(function(error, user) {
      if(error) {
        console.log("can't save")
      } else {
        res.redirect('/login')
      }
    })
  }
});



app.listen(3000);

module.exports = app;
