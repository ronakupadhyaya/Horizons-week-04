"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var localstrat = require('passport-local').Strategy;
var validator = require('express-validator');
var User = require('./models/models').User;
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));

//Hashing setup

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// MONGODB SETUP HERE
var mongoose = require('mongoose');

mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb!');
});

mongoose.connect('mongodb://dave:dave@ds131782.mlab.com:31782/vault')

// SESSION SETUP HERE
// var session = require('cookie-session');

// app.use(session({
//   name: 'test',
//   keys: ['countryfriedsteak'],
//   maxAge: 1000*60*2
// }));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


app.use(session({
  secret: 'countryfriedsteak',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))
// PASSPORT LOCALSTRATEGY HERE

var db = require('./passwords.plain.json');
var hashdb = require('./passwords.hashed.json');


passport.use(new localstrat(
  function(username, password, done) {
    var hashedPw = hashPassword(password);

    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      console.log(user);
      if (user.password !== hashedPw){
        return done(null, false, { message: 'Incorrect password.' });
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      return done(null, user);
    });

    // for (var i = 0; i < hashdb.passwords.length; i++){
    //   if (username === hashdb.passwords[i].username && hashedPw === hashdb.passwords[i].password){
    //     done(null, hashdb.passwords[i]);
    //     return;
    //   }
    // }
    // for (var i = 0; i < db.passwords.length; i++){
    //   if (username === db.passwords[i].username && password === db.passwords[i].password){
    //     done(null, db.passwords[i]);
    //     return;
    //   }
    // }
    // done(null, false);
  }));
    // db.passwords.forEach(function(user){
    //   if (username === db.passwords.user && password === db.passwords.password){
    //     return done(null, user);
    //   }
    //   return done(null, false, {message: 'Incorrect username or password.'});
    // })



  //   db.passwords.findByUsername(username, function(err, user) {
  //     if (err) {
  //       return users(err);
  //     }
  //     // if the database errors out then return an error on first callback
  //     if (!user) {
  //       return users(null, false);
  //     }
  //     // return false if user was not found, can redirect to another page
  //
  //     if (user.password != password) {
  //       return cb(null, false);
  //     }
  //     // wrong password
  //
  //     return users(null, user);
  //     // if user and password are correct, then return no error and the user
  //   });
  // }));

// passport.use(new localstrat(
//
//   function(username, password, cb) {
//
//     if(username in users && users[username] === password){
//       done(null, user);
//     }
//     else{
//       done(null, false);
//     }
//   }
// ));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  // for (var i = 0; i < db.passwords.length; i++){
  //   if(id === db.passwords[i]._id){
  //     done(null, db.passwords[i]);
  //     return;
  //   }
  // }
  User.findById(id, function(err, user){
    if(err){
      done(null, false);
    }
    else{
      done(null, user);
    }
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res){
  if (!req.user){
    res.redirect('/login');
  }
  else{
    res.render('index', {
      user: req.user
    });
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
  // var user = req.checkBody('username').notEmpty().isString();
  // var pw = req.checkBody('password').notEmpty().isString();

  if(req.body.username && req.body.password){
    var newUser = new User({username: req.body.username, password: hashPassword(req.body.password)})

    newUser.save(function(err){
      if (err){
        res.send(err);
      }
      else{
        res.redirect('/login');
      }
    });
  }
  else{
    res.redirect('/signup');
  }
})

app.listen(3000);

module.exports = app;
