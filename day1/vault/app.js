"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Passwords = require('./passwords.plain.json');
var hPasswords = require('./passwords.hashed.json');
var models = require('./models/models')
var User = models.User;
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function() {
  console.log("I feel a connection")
});
mongoose.connect(process.env.MONGODB_URI)

// SESSION SETUP HERE
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
    secret: "I hate the taste of watermelon",
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}
// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done){
//     for(var i = 0; i < Passwords.passwords.length; i++){
//       if((username === Passwords.passwords[i].username) && (password === Passwords.passwords[i].password)){
//           return done(null,  Passwords.passwords[i])
//         } else{console.log("NOPE")}
//       }
//     }
// ));

// passport.use(new LocalStrategy(
//   function(username, password, done){
//     var hpass = hashPassword(password)
//     for(var i = 0; i < hPasswords.passwords.length; i++){
//       if((username === hPasswords.passwords[i].username) && (hpass === hPasswords.passwords[i].password)){
//           return done(null,  hPasswords.passwords[i])
//         } else{console.log("NOPE")}
//       }
//     }
// ));


// This isn't finished but it starts
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username, password: password}, function(err, doc){
      if(err){console.log("CAN'T EVEN BEGIN TO FIND BECAUSE: " + err)}
      //if doc is found it'll be truthy
      else if(doc){}
    })
  }
))


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  var user = null;
  // for(var i = 0; i< Passwords.passwords.length; i++){
  //   if( Passwords.passwords[i]._id === id){
  //     user = Passwords.passwords[i];
  //   }
  // }
  User.findById(id, function (err, doc){
  if (err){
    console.log("WHY NO DESERIALISE: " + err)
  }
})
  done(null, user);
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login')
  } else{
    res.render('index', {user: req.user})
  }

})

app.get('/login', function(req, res){
  res.render('login')
})

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})


app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/singup', function(req,res){
  if((!!req.body.username) && (!!req.body.password)){
    var newUser = new User({username: req.body.username, password: req.body.password})
    newUser.save(function(err, usr){
      if(err){console.log("THIS ISN'T WORKING OUT: " + err)}
      else{res.redirect('/login')}
    })
  }
})


module.exports = app;
