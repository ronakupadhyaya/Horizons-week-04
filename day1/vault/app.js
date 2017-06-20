"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var User = require('./passwords.hashed.json').passwords;
var Profile= require('./models/models.js').User;
var session= require('express-session');
var MongoStore = require ('connect-mongo')(session)
var crypto = require('crypto');



function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log("Connected to MongoDb")
});
mongoose.connect('mongodb://maxiliarias:moralia6@ds041140.mlab.com:41140/vault');

// SESSION SETUP HERE
app.use(session({
  secret: 'bestteam',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


  // PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
     Profile.findOne({username:username},function(err,user){
       if(err){
         res.json(err)
       }
       else if (user){
           if(user.hashedPassword === hashPassword(password)){
             done (null,user);
           } else{
             done (null,false, { message: 'Incorrect username or password.'});
           }
        }
       })
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
  passport.serializeUser(function(user,done){
    done(null,user._id);
  })

  passport.deserializeUser(function(id,done){
    Profile.findById(id,function(err,userFn){
      if(err){
        res.json({
        failure:err
      })
    }else{
        if(userFn){
          done(null,userFn);
        }
        else{
          done(null, false);
        }
      }
    })

  })

// YOUR ROUTES HERE
app.get('/',function(req,res){
  if(req.user){
    res.render('index',{
      user: req.user
    });
  }
  else {
    res.redirect('/login')
  }
})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})
app.get('/signup',function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){
  var username= req.body.username;
  var password= hashPassword(req.body.password);
  if(username && password){
    var newUser= new Profile({
      username:username,
      hashedPassword:password
    })

    console.log(newUser)

    newUser.save(function(err,saved){
      if(err){
        res.json({failure:err})
      }else{
        res.redirect('/login')
      }
    })
  }
})

module.exports = app;
