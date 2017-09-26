"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var passwordList = require('./passwords.plain.json');
var hashedList = require('./passwords.hashed.json');
var handleBars = require('handlebars');
var expressHandlebars = require('express-handlebars');
var models = require('./models/model.js')
console.log(passwordList.passwords);


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
  console.log('Connected to MongoDb!');
})
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// var session = require('cookie-session');
// app.use(session({
//   keys: ['anita bath'],
//   maxAge: 1000*5*2
// }))
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session(
  {secret: 'maya butreeks',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new localStrategy(
//   function(username, password, done) {
//     for(var i = 0; i < passwordList.passwords.length; i++){
//       if(passwordList.passwords[i].username === username && passwordList.passwords[i].password === password){
//         //console.log("User and password matches")
//         done(null, passwordList.passwords[i]);
//       }
//       //console.log('Iternation number ' + i + ' failed.')
//     }
//     done(null, null);
//     //console.log('User is not in passwordList')
//   }
// ));


// passport.use(new localStrategy(
//   function(username, password, done){
//     var hashedPassword = hashPassword(password);
//     for(var i = 0; i < passwordList.passwords.length; i++){
//       if(hashedList.passwords[i].username === username && hashedList.passwords[i].password === hashedPassword){
//         done(null, hashedList.passwords[i]);
//       }
//     }
//     done(null, null);
//   }
// ))

passport.use(new localStrategy( function(username, password, done){
  models.User.findOne({username: username}, function(err, user){
    if(err){
      console.log(err);
      return done(err);
    }
    if(user){
      console.log('User is not found');
      return done(null, false);
    }
    if(user.password !== password){
      return done(null, false);
    }
    return done(null, user);
  })
}))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function (user, done){
  done(null, user._id);
});


// passport.deserializeUser(function(id, done) {
//   var user;
//   for(var i = 0; i < passwordList.passwords.length; i++){
//     if(passwordList.passwords[i]._id === id){
//       //console.log(passwordList.passwords[i].username)
//       user = passwordList.passwords[i].username;
//       done(null, user);
//     }
//   }
// });

passport.deserializeUser(function(id, done){
  var foundUser;
  user.findById({_id: id}, function(error, result){
    if(error){
      console.log('Error in finding user');
      return;
    } else if(result.length === 0){
      console.log('User does not exist');
      return;
    } else {
      foundUser = result;
    }
  })

  done(null, foundUser);
})

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user);
  if(!req.user){
    res.redirect('/login');
  } else {
    res.render('index', {user: req.user});
  }
});

app.get('/login', function(req, res){
  res.render('login')
});

app.post('/login', passport.authenticate('local',
  { successRedirect: '/', failureRedirect: '/login' })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})
app.get('/signup', function(req, res){
  res.render('signup');
})

app.post('/signup', function(req, res){
  req.check(req.body.username, 'Username required').notEmpty();
  req.check(req.body.password, 'Password required').notEmpty();
  var error = req.validationErrors();
  if(error.length === 0){
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
  }
  console.log('New user registered successfully!');
  res.redirect('/login');
});

module.exports = app;

app.listen (3000);
