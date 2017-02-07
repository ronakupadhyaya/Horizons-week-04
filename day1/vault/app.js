"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json');
var hashedUser = require('./passwords.hashed.json');
var mongoose = require('mongoose');
// var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var validator = require('express-validator');
var User = require('./models/models');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});

mongoose.connect('mongodb://jonathanzinger:chub4Life@ds145019.mlab.com:45019/ballsack');

// SESSION SETUP HERE

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(function(username, password, done) {
  var hashedPassword = hashPassword(password);
  User.findOne({ username:username }, function(err, userObject) {
    if(err) {
      done(err, null);
    } else if(hashedPassword ===  userObject.password) {
      done(null, userObject);
    } else {
      done(null, false);
    }
  })
}))

//   for(var i = 0; i < hashedUser.passwords.length; i++) {
//     if(hashedUser.passwords[i].username === username) {
//       console.log('correct username');
//       if(hashedUser.passwords[i].password === hashedPassword) {
//         console.log('correct password')
//         return done(null, {
//           username: hashedUser.passwords[i].username,
//           password: hashedUser.passwords[i].password,
//           id: hashedUser.passwords[i]._id
//         })
//       }
//       return done(null, false, {
//         message: 'Incorrect password'
//       })
//     }
//   }
//   done(null, false, {
//     message: 'Incorrect username'
//   })
// }));

// app.use(session({
//   keys: ['bubblebutt'],
//   maxAge: 1000*60*2
// }))

// app.use(session({
//   secret: 'bubblebooty'
// }))

app.use(session({
  secret: 'bubblebooty',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection })
}))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(user, done) {
  User.findOne({username: user}, function(err, found) {
    if(err) {
      console.log(err);
    } else {
      done(null, found);
    }
  })
})

//   var userObject;
//   for(var i = 0; i < passwords.passwords.length; i++) {
//     if(user === passwords.passwords[i].username) {
//       userObject = passwords.passwords[i];
//     }
//   }
//   done(null, userObject);
// })

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if(!req.user) {
    res.redirect('/login');
  } else {
    res.render('index.hbs', {
      user: req.user
    })
  }
});

app.get('/signup', function(req, res) {
  res.render('signup.hbs');
})

app.post('/signup', function(req, res) {
  //TODO: validate with express-validator
  User.findOne({username:req.body.username}, function(err, found) {
    if(err) {
      console.log(err)
    } else if(found) {
      console.log("Username already exists")
    } else {
      var user = new User({
        username: req.body.username,
        password: hashPassword(req.body.password)
      })
      user.save(function(err) {
        if(err) {
          console.log('Not saved!');
          console.log(err);
        } else {
          res.redirect('/login');
        }
      });
    }
  })
})

app.get('/login', function(req, res) {
  res.render('login.hbs');
});

app.post('/login',
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

console.log('Express started. Listening on port', process.env.PORT || 8000);
app.listen(process.env.PORT || 8000);

module.exports = app;
