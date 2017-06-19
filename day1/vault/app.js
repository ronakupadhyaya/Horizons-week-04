"use strict";

var User = require('./models/models.js').User;

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var passwordDB = require('./passwords.hashed.json');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB')
})

mongoose.connect('mongodb://andrew-eells:aeells4021996@ds131512.mlab.com:31512/login-practice')




// SESSION SETUP HERE
// var session = require('cookie-session');
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }))

var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: "your secret here",
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}))


// PASSPORT LOCALSTRATEGY HERE  (PART 1)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done){ //done is the same as cb (callback)
    // var password = hashPassword(password);
    // var pass_array = passwordDB.passwords;
    // var user = null;
    //
    // for(var i = 0; i < pass_array.length; i++){
    //   if( pass_array[i].username === username && pass_array[i].password === password  ){
    //     user = pass_array[i];
    //     break;
    //   }
    // }
    //
    // if( user !== null  ){
    //   done(null,user);
    // }else{
    //   done(null,false);
    // }

    User.findOne({ username: username}, function(err, user){
      if( user.hashedPassword === hashPassword(password)){
        done(null, user)
      }else{
        done(null, false)
      }
    })

  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

//this would generally be a complicated function to serialize them for security reasons
passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err){
      console.log('problem finding user')
      done(null, null);
    }else{
      done(null, user);
    }
  });
  // var pass_array = passwordDB.passwords;
  // var user = null;
  //
  // for(var i = 0; i < pass_array.length; i++){
  //   if( pass_array[i]._id === id ){
  //     user = pass_array[i];
  //     break;
  //   }
  // }
  //
  // done(null, user);

})

// PASSPORT MIDDLEWARE HERE


// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user)  //is printing undefined
  if(!req.user){
    res.redirect('/login');
  }else{
    res.render('index', {user: req.user});
  }


})

app.get('/login', function(req,res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))


app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup');
})

app.post('/signup', function(req,res){
  var username = req.body.username
  var password = hashPassword(req.body.password)

  if(username && password){
    var user = new User({
      username: username,
      hashedPassword: password
    })

    user.save(function(err){
      if(err){
        console.log('saving to mongodb failed')
      }else{
        res.redirect('/login');
      }
    });

  }
})


//HASHING
var crypto = require('crypto')
function hashPassword(password){
  var hash = crypto.createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}



module.exports = app;
