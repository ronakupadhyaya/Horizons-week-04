"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var plainPasswords = require('./passwords.plain.json');
var plainPasswords = require('./passwords.hashed.json');
var dbArr = plainPasswords.passwords;
// var session = require('cookie-session');
var mongoose = require('mongoose')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}


// function hash(password){
//   hashPassword(password)
// }
//
// if (hashPassword(passwordAttempt)===storedPasswordHash){
//   //Successful login
// } else {
//   //Fail Login
// }

//Setup MLab DB
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!')
})
mongoose.connect('mongodb://dondyu:SED8221DenSon2905@ds139939.mlab.com:39939/don-horizons')


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
app.use(session({
  secret: 'don is best',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// SESSION SETUP HERE
// app.use(session({
//   keys: ['secret string'],
//   maxAge: 1000*2*60
// }))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username,password,done) {
    var hashedPassword = hashPassword(password);
    var newArr = dbArr.filter(function(element){
      return (element.username === username && element.password === hashedPassword)
    })
    if (newArr.length!==1){
      return done(null, false)
    } else if (newArr.length ===1){
      return done(null, newArr[0])
    }
  })
)

// passport.use(new LocalStrategy(
//   function(username,password,done) {
//     var user = {username: null, password: null};
//     dbArr.forEach(function(element){
//       if (element.username === username){
//         user.username = username;
//         if (element.password === password){
//           user=element;
//         }
//       }
//     })
//     if (user.username === null){
//       return done(null, false, {message: "Incorrect username"})
//     } else if (user.password === null) {
//       return done(null, false, {message: "Incorrect password"})
//     } else {
//       return done(null, user)
//     }
//   })
// )


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id,done){
  var user = dbArr.filter(function(element){
    return element._id === id
  })
  user = user[0];
  done(null, user)
})


// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  if (!req.user){
    res.redirect('/login');
  } else {
      res.render('index', {
        user: req.user
      });
  }

})
app.get('/login', function(req, res){
  res.render('login');
})


app.post('/login',
)
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.listen(3000)
module.exports = app;
