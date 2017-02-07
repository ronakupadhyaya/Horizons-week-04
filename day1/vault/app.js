"use strict";

var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var inputFile = require('./passwords.hashed.json');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models.js').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//hashpassword function
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!');
});
mongoose.connect('mongodb://clairehuang:clairehuang@ds145019.mlab.com:45019/week4day1')

// SESSION SETUP HERE

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(
  function(username, password, done){
    var hashedPassword = hashPassword(password);
    // var user;
    // inputFile.passwords.forEach(function(x){
    //   if (x.username === username && x.password === hashedPassword){
    //     user = x;
    //   }
    // })
    // if (user){
    //   done(null, user)
    // }else{
    //   done(null,false)
    // }
    User.findOne({username:username}, function(err, user){
      if (hashedPassword === user.password){
        done(null,user);
      } else{
        done(null, false);
      }
    })
  }
))



// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  User.findById(id, function(err, user){
    console.log(user);

      done(null, user);

  })

});

// PASSPORT MIDDLEWARE HERE



app.use(session({
  secret: 'asuh fam i am so secret',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))
app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE

app.get('/', function(req, res){
  if (!req.user){
    res.redirect('/login')
  }else{
  res.render('index.hbs', {user: req.user});
  }
})

app.get('/login', function(req, res){
  res.render('login.hbs');
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup');
})

app.post('/signup', function(req,res){
  // req.checkBody('password', 'Empty password').notEmpty();
  // var errors = req.validationErrors();
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username:username}, function(err, foundUser){
    // if (foundUser.length){
    //   errors = true;
    // }
    if (foundUser){
      console.log("there be some validation errors");
    } else{
      var newUser = new User({
        username: username,
        password: hashPassword(password)
      });
      newUser.save(function(err) {
        if (err) {
          console.log('there be some errors')
        } else {
          res.redirect('/login');
        }
      });

    }
  })
})
module.exports = app;
app.listen(3000);
