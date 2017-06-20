"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userdb = require('./passwords.hashed.json');
var mongoose = require('mongoose');
var User = require('./models').User;
// console.log("USer",User)
console.log(User.find().collections)
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
mongoose.connection.on('connected',function(){
  console.log('connected to mongoose')
})
mongoose.connect('mongodb://sch1:1@ds133192.mlab.com:33192/vault_shenchenhui')
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// SESSION SETUP HERE
//old session setup
// var session = require("cookie-session"); //must be before app.use
// app.use(session({
//   keys: ["password"],
//   maxAge: 1000*60*2
// }))
var session = require("express-session");
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret:"apple",
  store: new MongoStore({mongooseConnection:require("mongoose").connection})
}))

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPassword = hashPassword(password);
    // try{
      //  var user;
      //   var validate = false;
      //   userdb.passwords.forEach(function(item){
      //     if(item.username === username){
      //       console.log(username)
      //       if(item.password === hashedPassword){
      //         user = item;
      //         validate = true;
      //       }
      //     }
      //   })
      //   if(validate){
      //     done(null, user)
      //   }else {done(null,false, {message:"incorrect"})}

        User.findOne({name:username},function(err,user){
          if(user.hashedPassword === hashedPassword){
            done(null,user);
          } else {done(null,false)}
        })


    //  }catch(e){console.log("ERROR")}
   }
 ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
app.use(passport.initialize());
app.use(passport.session()); //enables attaching req.user


// PASSPORT MIDDLEWARE HERE
passport.serializeUser(function(user,done){ //done is just a function
  done(null,user._id); //once authenticate, store the userid as cookie
})
//same as tokenization

passport.deserializeUser(function(id,done){
  var user;
  // userdb.passwords.forEach(function(item){
  //   if(item._id === id){
  //     console.log(item);
  //     user = item;
  //   }
  // })
  User.findById(id,function(err,user){
    if(err){done(null,false)}
    else {done(null, user);}
  })
})

// YOUR ROUTES HERE
app.get('/',function(req,res){
  if(req.user){
    res.render('index', {user: req.user});
  }
  else{res.redirect('/login')}

})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login',
passport.authenticate('local',
{ successRedirect: '/',
failureRedirect: '/login'})
)

//alternative
// app.post('/login',
// passport.authenticate('local'),
// function(req,res){
//   res.redirect('/')
// })

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup',function(req,res){
  res.render('signup');
})

app.post('/signup',function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  req.check('username','username cannot be empty').notEmpty();
  req.check('password','password cannot be empty').notEmpty();
  var error = req.validationErrors();
  if(!error){
    // var user = new User ({
    //   name: username,
    //   password: password
    // })
    var u = new User({
      name: username,
      hashedPassword: hashPassword(password)
    })
    u.save();
    res.redirect('/login')
  } else {
    res.json({failure: "invalid registration"})
  }
})

app.listen(3000,function(){
  console.log("listening on port: 3000")
})
module.exports = app;
