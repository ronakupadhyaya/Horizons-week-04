"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var data = require('./passwords.hashed.json');
var LocalStrategy = passportLocal.Strategy;
var session = require("express-session");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);
var crypto = require("crypto");
var User = require("./models/models").User;

function hashpassword(password) {
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

app.use(session({
  secret: "somesecret",
  store: new MongoStore({mongooseConnection: require("mongoose").connection})
}));


// MONGODB SETUP HERE
mongoose.connection.on("connected", function() {
  console.log("connected to mongoDB!");
})
mongoose.connect("mongodb://test:test@ds131512.mlab.com:31512/vault-caroline");

// SESSION SETUP HERE
//app.use(express.session());

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));




// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    //locally decide how we will authenticate user login

    //done is kind of like next
    // var userFound = null;
    // var usernameFound = false;
    // var hashedPassword = hashpassword(password);
    // data.passwords.forEach(function(user) {
    //   if (user.username === username && user.password === hashedPassword) {
    //     userFound = user;
    //   } else if (user.username === username) {
    //     usernameFound = true;
    //   }
    // })
    // if (userFound) {
    //   return done(null, userFound);
    // } else if (usernameFound) {
    //   return done(null, false, { message: 'Incorrect password.' });
    // } else {
    //   return done(null, false, { message: 'Incorrect username.' });
    // }
    User.findOne({ username: username }, function (err, user) {
      var hashedPassword = hashpassword(password);
      console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== hashedPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));



// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
//user id gets stored inside a cookie in the browser
passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var userFound = null;
  // data.passwords.forEach(function(user){
  //   if (user._id === id) {
  //     userFound = user;
  //   }
  // })
  // return done(null, userFound);
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

// PASSPORT MIDDLEWARE HERE
//must be after cookie-session
app.use(passport.initialize()); //sets up passport
app.use(passport.session()); //enables attaching req.user

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if(!req.user) {
    res.redirect("/login");
  } else {
    res.render('index', {user: req.user});
  }
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login',
  passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.json({ user: req.user});
  });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/signup", function(req, res) {
  res.render("signup.hbs");
})

app.post("/signup", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    var newUser = new User({username: username, password: hashpassword(password)});
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    })
  }
})

module.exports = app;
