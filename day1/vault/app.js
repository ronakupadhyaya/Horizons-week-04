"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var User = require('./models/models.js');

// MONGODB SETUP HERE
var mongoose = require('mongoose');
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connect(process.env.MONGODB_URI);

//PASSWORD HASHING
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// SESSION SETUP HERE

//Cookie Session
/*var session = require('cookie-session');
app.use(session({
  keys:['kenyon'],
  maxAge: 1000*120
}));*/

//Store session stuff in Mlab

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'kenyon',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
//var passwordsPlain = require('./passwords.plain.json');
var passwordsHashed = require('./passwords.hashed.json');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({username:username},function(err,user){
      if(err){
        done(err,false);
      }
      else if(user.password === hashPassword(password)){
        done(null,user);
      }
      else{
        done(null,false);
      }
    });


    /*var user = null;
    var BreakException = {};
    try {
      passwordsHashed.passwords.forEach(function(item, index){
        if(item.username===username && hashPassword(password)===item.password){
          user = item;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    if(user){
      done(null, user);
    }
    else{
      done(null,false);
    }*/
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null,user._id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    if(err){
      console.log(err);
      done(err,false);
    }
    else{
      done(null,user);
    }
  });
  /*var user = null;
  var BreakException = {};
  try {
    passwordsHashed.passwords.forEach(function(item){
      if(item._id === id){
        user = item;
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  if(user){
    done(null, user);
  }
  else{
    done(null,false);
  }*/
});
// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

module.exports = app;

app.get('/',function(req,res){
  if(req.user){
    res.render('index',{user:req.user});
  }
  else{
    res.redirect('/login');
  }
});

app.get('/login',function(req,res){
  res.render('login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/signup',function(req,res){
  res.render('signup');
});

app.post('/signup',function(req,res){
  if(!req.body.username || !req.body.password){
    res.redirect('/signup');
  }
  var newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log("Error:",err);
    }
    res.redirect('/login');
  });
});
