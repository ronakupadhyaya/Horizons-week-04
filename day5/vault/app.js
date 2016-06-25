var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var cookieSession = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Models = require('./models/models');
var User = Models.User;


// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js
var models = require('./models/models');
var userPasswords = require('./passwords.plain.json').passwords;

// app.use(cookieSession({keys:['my secret for signing cookies'], maxAge:1000*60*2}));
app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){ 
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  models.User.findById(id,function(err, user){
  return done(err, user);
});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
      var hashed = hashPassword(password);
    models.User.findOne({username:username}, function(err,user){
      if(user.password === hashed){
        return done(null, user);
      } else{
        return done(null, false);
      }
    })
  }
));

// var hashed = require('./passwords.hashed.json').passwords;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var hash = hashPassword(password);
//     for(var i =0; i<passwords.length;i++){
//     if(username === passwords[i].username && hash === passwords[i].password){
//      return done(null, passwords[i]);
//     }
//   }
//   return done(null, false);   
// }));
 
app.post('/login',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));

// GET /: This route should only be accessible to logged in users.

app.get('/login',function(req,res){
  res.render('login')
});

app.get('/signup',function(req, res){
  res.render('signup')
});

app.post('/signup',function(req,res){
  var u = new models.User({
    username:req.body.username, 
    password: hashPassword(req.body.password)}).save(function(err){
      if (err){
        res.redirect('/signup');
        return;
      } else{
        res.redirect('/login');
      }
    })
});

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');
});

app.get('/', function(req, res, next) {
  if(req.user){ 
   res.render('index');
    } else{
      res.redirect('/login')
    }
});

// catch 404 and forward to error handler


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
