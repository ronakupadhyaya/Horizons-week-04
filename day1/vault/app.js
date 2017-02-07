"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.hashed.json').passwords;
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto')
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}))
// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function () {
  console.log('CONNECTED TO MONGODB YOU FUCK')
});
mongoose.connect('mongodb://bennett-mertz:Wsm33001@ds145019.mlab.com:45019/pervin-irvin')
// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        console.log("you rnt real u fuck");
        res.redirect('/signup')
      }
      else {
        console.log(user)
        if (user.hashedPassword === hashPassword(password)) {
          done (null, user)
        } else {
          done(null, false)
        }
      }
    })
  }
));
    // passwords.forEach(function (user) {
    //   var hashedPassword = hashPassword(password)
    //   console.log(hashedPassword)
    //   if (user.username === username && user.password===hashedPassword) {
    //     return done(null, user) //no error but found a user!
    //   }
    // })
    // console.log("faield")
    // return done(null, false)
    //no error(null) didn't find a user (false)

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      res.status(500)
    } else {
      done(null, user)
    }
  })
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize())
app.use(passport.session())
// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.render('index', {user: req.user});
  }
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function (req, res) {
  res.render('signup')
})

var User = require('./models/models').User; //this probably shouldn't be here

app.post('/signup', function (req, res) {
  console.log("rec.body", req.body)
  if (req.body.password !== "" || req.body.username!=="") {
    var shit = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    shit.save(function(err) {
      if (err) {
        res.status(500)
      } else {
        console.log("save - User", shit)
        res.redirect('/login')
      }
    })
  } else {
    res.status(500)
  }
})

// app.post('/signup', function (req, res) {
//   console.log("rec.body", req.body)
//   if (req.body.password !== "" || req.body.username!=="") {
//     var poop = new User({
//       username: req.body.password,
//       password: req.body.username
//     })
//     poop.save(function(err) {
//       if (err) {
//         res.status(500)
//       } else {
//         console.log("save - User", poop)
//         res.redirect('/login')
//       }
//     })
//   } else {
//     res.status(500)
//   }
// })









module.exports = app;
