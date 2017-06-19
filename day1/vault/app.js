"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.hashed.json');
// var session = require('cookie-session');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var userDb = require('./models/models').User

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000 * 60 * 2
// }));


app.use(session({
  secret: 'your secret here',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// MONGODB SETUP HERE
mongoose.connection.on('connected', function () {
  console.log("connected to MongoDB")
});
mongoose.connect("mongodb://ben:12345678@ds133192.mlab.com:33192/topsecret")

// SESSION SETUP HERE



// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function (user, password, done) {

    userDb.findOne({
      username: user
    }, function (err, user1) {
      if (user1.hashedPassword === hashPassword(password)) {
        done(null, user1);
      } else {
        done(null, false);
      }
    })
    // var array = db.passwords;
    // var flag = false;
    //
    // array.forEach(function (item) {
    //   if (item.username === user && item.password === hashPassword(password)) {
    //     done(null, item);
    //     flag = true;
    //   }
    // })
    // if (!flag) {
    //   done(null, false);
    // }
  }));


function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  var user;
  console.log("id is ", id)
  userDb.findById(id, function (err, user1) {
    if (err) {
      console.log("error loggin out");
    }
    if (user1) {
      console.log(user1);
      user = user1;
      done(null, user);
    }
  })

  // db.passwords.forEach(function (item) {
  //   if (item._id === id) {
  //     user = item;
  //   }
  // });

})

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

app.get("/", function (req, res) {

  if (req.user === undefined) {
    console.log("false", req.user);

    res.redirect("/login");
  } else {
    console.log("render", req.user);
    res.render("index", {
      user: req.user
    });
  }

});

app.get("/login", function (req, res) {
  res.render("login");
});



app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}));

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect('/');
})

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.post("/signup", function (req, res) {

  if (req.body.username.length > 0 && req.body.password.length > 0) {

    var newUserDb = new userDb({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });

    newUserDb.save(function (err) {
      if (err) {
        res.status(500).send("can save user");
      } else {
        res.redirect("/login");
      }
    })
  } else {
    res.redirect("/signup");
  }

});

module.exports = app;
