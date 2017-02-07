"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local')
var passwords = require('./passwords.hashed.json');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;
var validate = require('express-validator');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB');
})
mongoose.connect('mongodb://moose:moose@ds145019.mlab.com:45019/vault_rpoc')

// SESSION SETUP HERE
app.use(session({
  secret: 'cashmeoutsidehowbowdah',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.hashedpassword === hashPassword(password)){
        return done(null, user);
      }
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById({_id: id}, function(err, user) {
    done(err, user);
  });
  });

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login')
  }
  res.render('index', {user: req.user});
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup');
});

function validate(req){
  req.checkBody('username, Username is empty').notEmpty()
  req.checkBody('password, Password is empty').notEmpty()
}
app.post('/signup', function(req, res){
  validate();
  console.log('hi');
    var user = new User({
      username: req.body.username,
      hashedpassword: hashPassword(req.body.password)
    })
    user.save(function(err){
      if(err){
        console.log('Error: ', err);
      } res.redirect('/login');
    })
  });

console.log('Express started. Listening on port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);

module.exports = app;
