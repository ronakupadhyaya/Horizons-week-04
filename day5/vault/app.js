var crypto = require('crypto');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var app = express();
var userPasswords = require('./passwords.plain.json').passwords;
var userHashedPasswords = require('./passwords.hashed.json').passwords;
// var cookieSession = require("cookie-session");
// app.use(cookieSession({keys:["my secret for signing cookies"], }));
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
// app.use(session({secret: "your secret here"}));
app.use(session({
  secret: "your secret here",
  maxAge: 1000 * 60 *2,
  store: new MongoStore({ mongooseConnection: require("mongoose").connection})
}));
// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// This is the function we're going to use in Phases 4 and 5 to hash
// user passwords.
var crypto = require('crypto');

function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Models are defined in models/models.js
var models = require('./models/models');
var User = models.User;

// SET UP PASSPORT HERE
passport.use(new LocalStrategy(
  function(username, password, done){
    models.User.findOne({"username" : username, "hashedPassword" : hashPassword(password)},
        function(err, user){
          if(err){ return err
          } else { done(null, user);
          }
    })
}));


   //  var hashedPassword = hashPassword(password);
   // for (var i = 0; i < userHashedPasswords.length; i++){
   //  var user = userHashedPasswords[i];
   //    if(user.username === username && user.password === hashedPassword){
   //      return done(null, user)
   //   }
   //  }
  

passport.serializeUser(function(user, done){

  done(null, user._id);
});

passport.deserializeUser(function(userid, done) {
var user = User.findById(userid, function(err, res){
if(err) {return (err)}
})
done(null, user);

 // for (var i = 0; i < userPasswords.length; i++){
 //  var user = userPasswords[i]
 //  if(user._id === userid)
 //  return done(null, user)
 //  }
});

app.get("/signup", function(req, res, next){
  res.render("signup")
})

app.post("/signup", function(req, res, next){
  var u = new User ({
    "username": req.body.username,
    "hashedPassword": hashPassword(req.body.password)
  })
  u.save(function(err, user) {
    res.redirect("/")
  })

})

// app.use(function (req, res, next) {
//   var maxAge = 1000*60*2;
//   req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
//    return next();
// });

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function(req, res){
  res.render("login")
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


//THIS IS THE WALL - YOU MUST AUTHENTICATE
app.use(function(req, res, next){
  if(!req.user){
    res.redirect("/login");
  } else {
    return next();
  }
});



// // GET /: This route should only be accessible to logged in users.
app.get('/', function(req, res, next) {
  // Your code here.
  res.render('index');
});


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
