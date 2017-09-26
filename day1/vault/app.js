"use strict";
var fs = require('fs');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var passwords = require('./passwords.plain.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var validator = require('express-validator');
var User = require('./models/models.js').User;
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
// Express setup
var app = express();
app.use(validator());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require('mongoose');

if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
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
app.use(session({
  secret: 'easy',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// PASSPORT LOCALSTRATEGY HERE
passport.use(new Strategy(
  /*function(username, password, cb) {
    function isUser(element){
      var hashedPasswords = hashPassword(element.password);
      return element.username === username && hashedPasswords === hashPassword(password);
    };
    var user = passwords.passwords.find(isUser);
    if (user === null){
      return cb(null, false);
    }
    else{
      return cb(null, user);
    }*/
    function(username, password, cb) {
      var hashedPassword = hashPassword(password);
      User.findOne({username: username, hashedPassword: hashedPassword}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.hashedPassword != hashedPassword) { return cb(null, false); }
        return cb(null, user);
      });
  }));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  /*function isId(element){
    return element._id === id;
  };
  var check = passwords.passwords.find(isId);
  if (check === null){
    cb(null, false);
  }
  else{
    cb(null, check);
  }*/
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get('/', function(req, res){
  if (req.user){
    res.render('index', {
      user: req.user
    });
  }
  else{
    res.redirect('/login');
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res){
  res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  req.check('username', 'username must be specified').notEmpty();
  req.check('password', 'password must be specified').notEmpty();
  var error = req.validationErrors();
  if (error){
    res.status(400);
  }
  else{
    var newUser = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    newUser.save(function(error){
      if (error){
        res.status(400).send('Failed to save');
      }
      else{
        res.redirect('/login');
      }
    });
  }
});

module.exports = app;
app.listen(3000);
