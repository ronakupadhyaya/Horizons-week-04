"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json')
var hashedpasswords = require('./passwords.hashed.json')
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('./models/models.js').User;

mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://sungsu:sungsu@ds145019.mlab.com:45019/horizons-vault')


function hashPassword(password){
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





// SESSION SETUP HERE

//1
// var session = require('cookie-session');
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }));

// MONGODB SETUP HERE

//2
var session = require('express-session');
// app.use(session({secret: 'your secret here'}));

//3
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))




// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    //Look through the passwords.plain/hashed.json file
    //for the given username and password.
    // console.log("given: ",username, password);
    var hashedPassword = hashPassword(password);

    User.findOne({username:username}, function(err, user){
      if(err){}
      else{
        if(user){
          if(user.password === hashedPassword){
            done(null, user);
          }
          else{
            done(null, false);
          }
        }
      }
    })

    // var validUser;
    // (hashedpasswords.passwords).forEach(function(user){
    //     // console.log("checking: ", user.username, user.password);
    //     if(user.username === username && user.password === hashedPassword){
    //       validUser = user;
    //     }
    // });
    // if(validUser){
    //   done(null, validUser);
    // }
    // else{
    //   done(null, false);
    // }
  }
))
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
// Initialize Passport and restore authentication state, if any, from the
// session.

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  console.log(typeof id);

  User.findById(id, function(err, user){
    if(err){}
    else{
      if(user){
        done(null, user);
      }
      // else{
      //   done(null, false);
      // }
    }
  })

});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res){
  if(!req.user)
    res.redirect('/login');
  else
    res.render('index', {user: req.user});
})

app.get('/signup', function(req,res){
  res.render('signup');
});

app.post('/signup', function(req, res){

  var username = req.body.username;
  var password = hashPassword(req.body.password);

  //validation
  if(password){
    User.findOne({username:username}, function(err, user){
      if(user){
        //user found so invalid
        res.redirect('/signup');
      }
      else{
        var newUser = new User(
          {
            username: username,
            password: password
          }
        );
        newUser.save(function(err){
          if(err){}
          else{
            res.redirect('/login');
          }
        })
      }
    })
  }
})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

module.exports = app;

app.listen(3000);
