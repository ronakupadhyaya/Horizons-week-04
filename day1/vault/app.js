"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var _ = require('underscore');

var fs = require('fs');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var validator = require('express-validator');
app.use(validator());

// MONGODB SETUP HERE
var mongoose = require('mongoose');

if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
//
if (! process.env.MONGODB_URI) {//check if source env.sh has been run
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() { //prints when connected
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI); //establishes a connection to your database


//require models
// app.use(express.static(path.join(__dirname, 'models')));
var User = require('./models/models.js').User;

// SESSION SETUP HERE
//COOKIE SESSION SETUP
// var session = require('cookie-session');
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 1000*10
// }))

//MORE SECURE, using express-session
//this will maintain your session even after restarting the server
//collection called sessions is created in mongodb
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'secrethere',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))


// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordjson = require('./passwords.plain.json');
var hashedpasswords = require('./passwords.hashed.json')
passport.use(new LocalStrategy(
  function(username, password, done) {
    // var hashedPassword = hashPassword(password);
    // var matcheduser = _.findWhere(hashedpasswords["passwords"], {username: username, password: hashedPassword})
    // // var matcheduser = _.findWhere(passwordjson["passwords"], {username: username, password: password})
    // if(matcheduser){
    //   done(null, matcheduser);
    // } else{
    //   done(null,false);
    // }
    User.findOne({username: username}, function(err,user){
      var hashpword = hashPassword(password);
      if(user && user.hashedPassword===hashpword){
        done(null,user);
      }else{
        done(null,false);
      }
    })
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // var user = _.findWhere(passwordjson["passwords"], {_id: id})
  // var user = _.findWhere(passwordjson["passwords"], {_id: id})
  // done(null,user);

  User.findById(id, function(err, user) {
      if (err) { return done(err); }
      if(user){
        done(null, user);

      }else{
        console.log("cant deserialize user bc id not found");
      }
    });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());



// YOUR ROUTES HERE
// All of our routes are in routes.js
// var routes = require('./routes');
// app.use('/api', routes); //all routes will have /api infront, so dont have to put /api in urls in routes
app.get('/', function(req,res){
  if(req.user){
    console.log(req.user);
    res.render('index', {
      user: req.user
    });

  } else{
    res.redirect('/login');
  }

})

app.get('/login', function(req,res){
  res.render('login');
})


app.post('/login', passport.authenticate('local', {
  successRedirect:  '/',
  failureRedirect: '/login'
}), function(req,res){
  // ?????
})

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})


app.get('/signup', function(req,res){
  res.render('signup');
})

app.post('/signup', function(req,res){

  var username = req.body.username;
  var password = req.body.password;
  req.checkBody('username', 'must enter username').notEmpty();
  req.checkBody('password', 'must enter password').notEmpty();
  //TODO DO WE NEED TO ALSO CHECK THAT USERNAME IS NOT ALREADY TAKEN

  var errors = req.validationErrors();
  if(errors){
    console.log("validation errors", errors);
  }else{
    var newuser = new User({username: username, hashedPassword: hashPassword(password)});
    newuser.save(function(error){
      if(error){
        console.log("error saving new user",error);
      }else{
        res.redirect('/login');
      }
    })
  }
  // User.findOne({username: username}, function(err,user){
  //   if(user){
  //
  //   }
  // })

  // res.render('signup');
})

//HASH PASSWORD TO MAKE IT MORE SECURE
//HASH PASWORDS BEFORE STORING THEM
var crypto = require('crypto')
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}



console.log('Express started. Listening on port', process.env.PORT || 3000);

// app.listen(process.env.PORT || 3000);


module.exports = app;
