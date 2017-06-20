"use strict";
//questions
//whats differece between cookie session and express session
// how to do the cookie thing in console
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var data = require('./passwords.plain.json')
var hashedData = require('./passwords.hashed.json')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var validator = require('express-validator')
var User = require('./models/models.js').User
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator())
// MONGODB SETUP HERE
mongoose.connection.on('connected',function(){
  console.log('connected to mongoose');
})
mongoose.connect('mongodb://amyzjin:Zilin3783@ds133162.mlab.com:33162/vault_amyzjin')
// SESSION SETUP HERE

app.use(session({
  secret:'secret password',
  store: new MongoStore({mongooseConnection:mongoose.connection})
}))

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE
function hashPassword(password) {
  var hash=crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex')
}

passport.use(new LocalStrategy(
  function(username,password,done){
    var hashedPassword2 = hashPassword(password)
    // for (var i = 0; i < data.passwords.length; i++) {
    //   if (username === data.passwords[i].username && password ===data.passwords[i].password){
    //     var user = data.passwords[i];
    //     done(null,user);
    //     return;
    //   }
    // }
    // done(null,false);
    User.findOne({username:username},function(err,user){
      if(err){
        done(null,null)
      }
      else if(user && user.hashedPassword===hashedPassword2){
        done(null,user)
      }
      else{
        done(null,false)
      }
    })
  }));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  console.log(user._id);
  done(null,user._id);
})

passport.deserializeUser(function(id,done){
//   var valid = false;
//   data.passwords.forEach(function(obj){
//     if (obj._id === id){
//       console.log(obj._id);
//       var user = obj;
//       done(null,user);
//       valid = true;
//     }
//   })
//   if (!valid) {
//     done(null, false);
//   }
// })

User.findById(id,function(err,user) {
  if (err){
    console.log(err);
    done(null,false)
  }
  else{
    done(null,user)
  }
})
})

// PASSPORT MIDDLEWARE HERE

// hashPassword('redhat')
// YOUR ROUTES HERE
app.get('/',function(req,res){
  console.log(req.user);
  if (req.user){
    res.render('index.hbs',{
      user:req.user});
  }
  else{
    res.redirect('/login')
  }
})

app.get('/login',function(req,res){
  res.render('login.hbs')
})

app.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}))

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup',function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){

  req.check('username','username is required').notEmpty();
  req.check('password','password is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    console.log(errors);
  }

  else{

    var newUser = new User({
      username:req.body.username,
      hashedPassword:hashPassword(req.body.password)
    })
    newUser.save(function(err) {
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/login')
      }
    })
  }

})

module.exports = app;
