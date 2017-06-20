"use strict";
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userdb = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var cookieSession = require('cookie-session')
var crypto = require('crypto');
var User = require('./models/models.js').User;
var expressValidator = require('express-validator');

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
app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cookieSession({
//   name: 'session',
//   keys: ['secrete key'],
//   maxAge: 2 * 60 * 1000 // 2 minutes
// }))


// MONGODB SETUP HERE
mongoose.connection.on('connected',function(){
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://zy:zy@ds133192.mlab.com:33192/week4-1')


// SESSION SETUP HERE
app.use(session({
  secret: 'secrete?',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username,
      hashedPassword: hashPassword(password)
    },
    function(err,user){
      if(user){return done(null,user);}
      else{return done(null,false)}
    })
  })
);

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  return done(null,user._id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    if(err){return done(null,false)}
    else{return done(null,user)}
  })
})
// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/signup',function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){
  req.check("username",'username cannot be empty').notEmpty();
  req.check("password",'password cannot be empty').notEmpty();
  var err = req.validationErrors();
  if(err){
    res.send(err)
  }
  else{
    var u = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    })
    u.save(function(e){
      if(e){res.send(e)}
      else{
        res.redirect('/login');
      }
    });
  }
})
app.get('/',function(req,res){
  if(req.user){
    res.render('index', {
      user: req.user
    })
  }
  else{
    res.redirect('/login');
  }
})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login',
  passport.authenticate('local'),
  function(req,res){
    res.redirect('/')
  }
);

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

app.listen('3000', function () {
  console.log('Example app listening on port 3000!')
})
module.exports = app;

// try{
//   var flag = false;
//   var incPass = false;
//   for(var i =0; i<userdb.passwords.length; i++){
//     var item = userdb.passwords[i];
//     if(item.username===username){
//       if(item.password===password){
//         flag = true;
//         break;
//       }
//       else{
//         incPass = true
//         break;
//       }
//     }
//   }
//   if(flag){
//     return done(null, item);
//   }
//   else if(incPass){
//     return done(null, false, { message: 'Incorrect password.' });
//   }
//   else{
//     return done(null, false, { message: 'Incorrect username.' });
//   }
// }
// catch (e) {
//   return done(e);
// }
