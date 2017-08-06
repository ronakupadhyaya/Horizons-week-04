"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;
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


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('connected to MONGODB');

})
mongoose.connect('mongodb://passport-tester:abc123@ds013901.mlab.com:13901/horizons-passport');

// SESSION SETUP HERE
// app.use(session({
//   keys: ['yash secret'],
//   maxAge: 60*1000*2
// }));

app.use(session({
  secret: 'yash secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var passwords = require('./passwords.plain.json').passwords;
var hashedPasswords = require('./passwords.hashed.json').passwords;

passport.use(new LocalStrategy(

  function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(hashPassword(password) === user.hashedPassword){
        done(null, user);
      } else{
        done(null, false);
      }
    });
  }

));


//   function(username, password, done){
//     var hashedPassword = hashPassword(password);
//
//    hashedPasswords.forEach(function(obj){
//     if(username === obj.username && hashedPassword === obj.password){
//       done(null, obj);
//       return;
//     }
//   })
//
//   done(null, false);
// }


  // function(username, password, done){
  //   passwords.forEach(function(obj){
  //     if(username === obj.username && password === obj.password){
  //       done(null, obj);
  //       console.log(obj);
  //       return;
  //     }
  //   })
  //   done(null, false);
  // }

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {

  User.findById(id, function(err, user){
    if(!err){
      done(null, user);
    } else{
      done(null, false);
    }
  });



  // var user;
  // passwords.forEach(function(obj){
  //   if(obj._id === id){
  //     user = obj;
  //   }
  // })
  // done(null, user);
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req, res){
  console.log('reached');
  if(!req.user){
    console.log('no req.user!');
    res.redirect('/login');
  } else if(req.user){
    res.render('index', {user: req.user});
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

app.get('/signup', function(req, res){
  console.log('invdgndjgshd');
  res.render('signup');
});

app.post('/signup', function(req, res){
  console.log(User);
  var newUser = new User({username: req.body.username, hashedPassword: hashPassword(req.body.password)});
  newUser.save(function(err){
    if(!err){
      res.redirect('/login');
    } else{
      res.send('Failed Registration');
    }
  });
});

module.exports = app;
app.listen(3000);
