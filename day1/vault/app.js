"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var session = require('cookie-session');
var data = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
var models = require('./models/models.js')
// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //express will look for views folder
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb!');
})
mongoose.connect('mongodb://test:test@ds131742.mlab.com:31742/horizons-vault')

// SESSION SETUP HERE
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*60*2
// }))
app.use(session({
  secret: 'my very secret password',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(function(username, password, done){
  models.User.findOne({username: username}, function(err, found){
    if(err){
      res.send(err);
    }else if(found){
      if(found.password===hashPassword(password)){
        return done(null, found)
      }else{
        //passwords don't match
        return done(null, false)
      }
    }else{
      //username not found
      return done(null, false)
    }
  })
}))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  console.log("Called serializeUser");
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
console.log("Called deserializeUser");
  models.User.findById(id, function(err,found){
    if(err){
      res.send(err);
    }else if(found){
      return done(null, found);
    }else{
      res.send("User not found");
    }
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res){
  console.log(req.user);
  if(req.user){
    res.render('index', {user: req.user});
  }else{
    res.redirect('/login');
  }

})

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

// same as above
// app.post('/login', passport.authenticate('local'), function(req, res){
//   res.redirect('/')
// })

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res){
  res.render('signup.hbs');
})

app.post('/signup', function(req, res){
  if(!req.body.username || !req.body.password){
    res.send('Username / password is invalid');
  }else{
    var user = new models.User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    });
    user.save(function(err){
      if(err){
        res.send(err);
      }else{
        res.redirect('/login');
      }
    })
  }
})

module.exports = app;
