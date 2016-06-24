var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userPasswords = require('./passwords.plain.json').passwords;
var userHashedPasswords = require('./passwords.hashed.json').passwords;
// var cookieSession = require('cookie-session');
var app = express();
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);

app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// app.use(cookieSession({keys: ['my secret for signing cookies']}))
//var user={};
app.use(session({secret: 'your secret here'}))

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
var crypto=require('crypto')
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js
var models = require('./models/models');
var User = models.User;
//var connect= reqquire('./models/connect')

// SET UP PASSPORT HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    // console.log(userPasswords.length)
    // for(var i=0; i<userPasswords.length; i++){
    //   if(userPasswords[i].username===username && userPasswords[i].password===password){
    //     var user=userPasswords[i];
    //     return done(null, user)
    //   }
    // }
    // return done(null, false)
    // var hashedPassword=hashPassword(password)
    // for(var i=0; i<userHashedPasswords.length; i++){
    //   if(userHashedPasswords[i].username===username && userHashedPasswords[i].password===hashedPassword){
    //     var user=userHashedPasswords[i];
    //     return done(null, user)
    //   }
    // }
    // return done(null, false)
    User.findOne({"username": username, "hashedpassword": hashPassword(password)}, function(err,user){
      if(err){
        return err
      }
      else{
        return done(null,user)
      }
    })
  }))

passport.serializeUser(function(user,done){
  //cookieSession.id=user._id
  done(null, user._id)
})

passport.deserializeUser(function(userid,done){
  // for(var i=0; i<userPasswords.length; i++){
  //   var user=userPasswords[i];
  //   if(user._id===userid){
  //     return done(null,user)
  //   }
  // }
  var user = User.findById(userid, function(err){
    if(err){
    return err
    }
  })
  done(null,user)
})

// app.use(function (req, res, next) {
//   req.sessionOptions.maxAge = 120000;
//   return next()
// })

app.use(passport.initialize());
app.use(passport.session());



app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))

// GET /: This route should only be accessible to logged in users.
app.use('/', function(req, res, next) {
  // Your code here.
  if(!req.user){
    res.redirect('/login')
  }
  else{
    return next()
    //res.render('index')
  }
});


app.get('/', function(req,res){
  res.render('index')
})

app.get('/signup', function(req,res){
  res.render('signup')
})

app.post('/signup', function(req,res){
  var u = new User({"username": req.body.username, "hashedpassword": hashPassword(req.body.password)})
  u.save(function(err,user){
    res.redirect('/')
  })
  
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

module.exports = app;
