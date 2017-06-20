"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var user=require('./passwords.hashed.json');
var session=require('express-session');
var models=require('./models/models.js')

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var MongoStore=require('connect-mongo')(session);
app.use(session({
  secret:'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));



// MONGODB SETUP HERE

var mongoose=require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to mongo');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE


//THESE LINES BELOW WERE USED FOR COOKIE DELETION BEFORE PART 3.2
    // var session=require('cookie-session');
    // app.use(session({
    //   keys: ['my very secret password'],
    //   maxAge: 1000*60*2
    // }))

// PASSPORT LOCALSTRATEGY HERE

passport.use(new LocalStrategy(

  function(username, password, done) {
    models.User.findOne({username:username}, function(err, user){

      if(user&&hashPassword(password)===user.hashedPassword){
        done(null, user);
      } else {
        done(null, false);
      }
    })
  })
);


//MEDIUM SECURE VERSION OF LOCAL STRATEGY BEFORE 5.1
  // passport.use(new LocalStrategy(
  //
  //   function(username, password, done) {
  //     var hashedPassword=hashPassword(password);
  //     var database=user.passwords;
  //     var found=false;
  //     // console.log(database);
  //     for (var i = 0; i < database.length; i++) {
  //       // console.log(database[i]);
  //       if (database[i].username===username&&database[i].password===hashedPassword) {
  //         found=true;
  //          done(null, database[i]);
  //          return
  //       }
  //     }
  //     // if(!found){
  //     //   done(null, false, {message: 'Incorrect login information.'});
  //     // }
  //   })
  // );

//LESS SECURE VERSION OF LOCAL STRATEGY BEFORE 4.2
  // passport.use(new LocalStrategy(
  //
  //   function(username, password, done) {
  //     var database=user.passwords;
  //     var found=false;
  //     // console.log(database);
  //     for (var i = 0; i < database.length; i++) {
  //       // console.log(database[i]);
  //       if (database[i].username===username&&database[i].password===password) {
  //         found=true;
  //          done(null, database[i]);
  //          return
  //       }
  //     }
  //     // if(!found){
  //     //   done(null, false, {message: 'Incorrect login information.'});
  //     // }
  //   })
  // );

var crypto=require('crypto');
function hashPassword(password){
  var hash=crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user){
    done(err, user);
  });
});

//DESERIALIZE BEFORE 5.1
  // passport.deserializeUser(function(id, done) {
  //   var database=user.passwords;
  //   for (var i = 0; i < database.length; i++) {
  //     // console.log(database[i]);
  //     if (database[i]._id===id) {
  //
  //        done(null, database[i]);
  //        return
  //     }
  //   }
  // });

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());


// YOUR ROUTES HERE

app.get('/', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else if(req.user){
  res.render('index', {user: req.user});
  }
});
app.get('/login', function(req, res){
  res.render('login');
});
app.post('/login', passport.authenticate('local',
  {successRedirect: '/',
  failureRedirect: '/login'})
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/signup', function(req, res){
  res.render('signup');
})
app.post('/signup', function(req, res){
  if(req.body.username&&req.body.password){
    var newUser= new models.User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password),
      //mongo generates id for you
      // id:user.passwords.length
    });
    newUser.save(function(err, savedUser){
      //IMPORTANT whenever in node always have to do callbacks or else they
      //won't happen in order unless in variables--but not functions
      //so res.redirect on outside doesn't work
        res.redirect('/login');
    });


  }
})




module.exports = app;
