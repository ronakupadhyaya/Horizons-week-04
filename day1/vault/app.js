"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var data = require('./passwords.plain.json');
// var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb!');
})
mongoose.connect('mongodb://spike:123321@ds115411.mlab.com:15411/the_vault');


// SESSION SETUP HERE

// app.use(session({
//   keys: ['kanye west is the greatest musician alive'],
//   maxAge: 1000*60*2
// }));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done){

  done(null, user._id)
});

passport.deserializeUser(function(id, done){
  // for(var i = 0; i < data.passwords.length; i++){
  //   if(data.passwords[i]._id === id){
  //     var user = data.passwords[i];
  //     console.log(user);
  //     return done(null, user);
  //   }
  // }
  User.findById(id, function(err, user){
    return done(null, user);
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());//enables attaching req.user

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    console.log('true');
    res.redirect('/login');
  } else {
    console.log('false');
  res.render('index', {user: req.user});
}
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
if(req.body.username && req.body.password){
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  console.log(user);
  user.save(function(err){
    if (err) {
      console.log('error', err);
      res.status(500).json(err);
    } else {
      res.redirect('/login');
    }
  })
}
});



app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

module.exports = app;
// app.listen(3000, function(){
//   console.log('Example app listening on port 3000!')
// })
