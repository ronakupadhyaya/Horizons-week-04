"use strict";

var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var models = require('./models/models.js');
var User = models.User

// var session = require('cookie-session')
var session = require('express-session')

var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session)

var crypto = require('crypto');
function hashPassword(password){

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
app.use(expressValidator())


// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!')
});
mongoose.connect('mongodb://brikang:password@ds025379.mlab.com:25379/vault')

// SESSION SETUP HERE
// app.use(session({
//   keys: ['test'],
//   maxAge: 1000*10
// }))

app.use(session({
  secret:'test',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
  var hashedPassword = hashPassword(password)
  User.findOne({username: username, hashedPassword: hashedPassword}, function (err, user) {
    console.log(user)
    if (err) {
      console.log(err);
      return done(null,false)
    } else if (user) {
      console.log('got valid user', user);
      return done(null,user)
    }
  })
}))

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password);
//     console.log(hashedPassword)
//     console.log(username)
//     User.findOne({username:username, password: hashedPassword}, function(err, user){
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       else if (err){
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       console.log(user)
//       return done(null, user);
//
//     });
//   }
// ));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var jsonFile = require('./passwords.plain.json');
//     var userArr = jsonFile.passwords
//     var foundUser = findUser(username);
//     if (!foundUser) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (foundUser.password !== password ) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     return done(null, foundUser);
//   }
// ));

//PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null, user._id)
})

passport.deserializeUser(function(id, done){
  var user = User.findById(id);
  console.log(user +"de")
  done(null,user)
})

// passport.deserializeUser(function(id, done){
//   var user = findId(id);
//   done(null,user)
// })

//helper function
function findUser(username){
  var jsonFile = require('./passwords.hashed.json');
  var userArr = jsonFile.passwords;
  var returnUser;
  userArr.forEach(function(user){
    if(username === user.username ){
      returnUser = user;
    }
  })
  return returnUser;
}

//helper function
function findId(id){
  var jsonFile = require('./passwords.hashed.json');
  var userArr = jsonFile.passwords;
  var returnUser;
  userArr.forEach(function(user){
    if(id === user._id ){
      returnUser = user;
    }
  })
  return returnUser;
}

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize())
app.use(passport.session())

// YOUR ROUTES HERE
app.get('/',function(req,res){
  if(!req.user){
    res.redirect('/login')
  } else{
  res.render('index', {user: req.user})
  }
})

app.get('/login',function(req,res){
    res.render('login')
})

app.post('/login', passport.authenticate('local'), function(req,res){
    res.redirect('/')
})

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup')
})

app.post('/signup', function(req,res){
  req.checkBody('username', 'Invalid Username').notEmpty();
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();

  if (errors){
    console.log("Error, user reqistration failed")
  } else{
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    })
    newUser.save(function(err,usr){
      if (err){
        res.json({failure: 'database error'})
      } else{
        res.redirect('/login');
      }
    })
  }
})








module.exports = app;
app.listen(3000);
