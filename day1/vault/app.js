"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var data=require('./passwords.plain.json');
var data1=require('./passwords.hashed.json')
//var session=require('cookie-session');
var mongoose=require('mongoose');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var crypto=require('crypto');
//var User=require('./models/models.js').User;
var models=require('./models/models');
var User=models.User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
mongoose.connection.on('connected',function(){
  console.log('Connected to MONGODB');
})
mongoose.connect(process.env.MONGODB_URI);
// SESSION SETUP HERE

// app.use(session({
//   keys: ['abc'],
//   maxAge:1000*60*2
// }));
app.use(session({
  secret:'abc',
  store:new MongoStore({mongooseConnection: require('mongoose').connection})
}));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username,password,done){
    // var hashedPassword=hashPassword(password);
    // var array=data1.passwords;
    // var flag=false;
    // array.forEach(function(item){
    //   if(item.username===username && item.password===hashedPassword){
    //     done(null,item);flag=true;
    //   }
    // })
    // if(!flag)done(null,false);

    models.User.findOne({username:username},function(err,user){
      //console.log(user._id);
      var hp=hashPassword(password);
      if(user.hashedPassword===hp){
        done(null,user);
      }else{
        done(null,false);
      }
    })

  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id,done){
  var user;
  console.log(id);
  User.findById(id,function(err,user){
    if(err)console.log(err);
    else{
      done(null,user);
    }
  })
  //done(null,user);
})
// PASSPORT MIDDLEWARE HERE

function hashPassword(password){
  var hash=crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// YOUR ROUTES HERE

app.get('/',function(req,res){
  if(req.user){
    res.render('index',
      {user: req.user}
    );
  }
  else{
    res.redirect('login')
  }

})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login',passport.authenticate('local',{
  successRedirect: '/',
  failiureRedirect: '/login'
}))

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})
app.get('/signup',function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){
  if(req.body.username && req.body.password){
  var hp=hashPassword(req.body.password)
  var newUser=new User({
    username:req.body.username,
    hashedPassword:hp
  })

  newUser.save(function(err){
    if(err)console.log(err);
    else{
      res.redirect('/login');
    }
  })}
})

app.listen(3000);
module.exports = app;
