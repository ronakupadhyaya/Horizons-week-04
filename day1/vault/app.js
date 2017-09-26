"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./passwords.hashed.json');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

var User = require('./models/models.js');

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

console.log(db);
//console.log(hashPassword(db.passwords[0].password));
//var mongoose = require('mongoose');
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE
// app.use(session({
//   keys: ['a'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret:'a',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hp = hashPassword(password);
//     for(var i = 0; i < db.passwords.length; i++){
//       if(db.passwords[i].username === username && db.passwords[i].password === hp){
//         return done(null, db.passwords[i]);
//       } //if(db.passwords[i].username === username && db.passwords[i].password !== password){
//   }
//   return done(null, false);
// }
  function(username, password, done){
    User.findOne({username: username}, function(err, result){
      if(result.password === hashPassword(password)){
        console.log('Found user.');
        done(null, result);
      }else{
        console.log('Could not find user.');
        done(null, false);
      }
    });
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var user = {};
  // var err = true;
  // db.passwords.forEach(function(person){
  //   if(person._id === id){
  //     user = person;
  //     err = null;
  //   }
  // })
  User.findById(id,function(err, user){
    if(err){
      console.log('Error finding the id.');
      done(null, false);
    }else{
      done(null, user);
    }
  })
});
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req);
  if(!req.user){
   res.redirect('/login');
  }else{
    res.render('index',{user: req.user});
  }
})
app.get('/login', function(req, res){
  res.render('login');
})
app.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})
app.get('/signup', function(req,res){
  res.render('signup');
})
app.post('/signup', function(req,res){
  User.findOne({
    username: req.body.username
  }, function(err, result){
      if(err){
        res.send('Username is already taken.');
      }else if(result === null){
        var newUser = new User({
          username: req.body.username,
          password: hashPassword(req.body.password)
        });
        newUser.save(function(error, results){
          if(error){
            console.log('New user creation failed');
          }else{
            console.log('New user created.');
            res.redirect('/login');
          }
        })
        console.log('Successful');
      }else{
        console.log('User already exists');
        res.redirect('/login');
      }
    })
  })

module.exports = app;
