"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var fs = require('fs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models').User;
var validator = require('express-validator');


// Express setup
var app = express();
app.engine('hbs', exphbs({extname:'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

// MONGODB SETUP HERE
var mongoose = require('mongoose');

if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {//check if source env.sh has been run
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() { //prints when connected
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {//error connecting
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI); //establishes a connection to your database


//FUNCTIONS
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// SESSION SETUP HERE
app.use(session({
  secret:'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));
// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passSet = require('./passwords.hashed.json');
passport.use(new LocalStrategy(
  function(username, password, done) {
    var hashedPass = hashPassword(password)
    User.findOne({username:username}, function(err,user){
      if (user.hashedPassword === hashedPass){
        done(null, user);
      }else{
        done(null,false);
      }
    })
    // var data = passSet.passwords.filter(function(item){
    //   return item.username === username && item.password === hashedPass
    // })
    // if (data.length > 0) {
    //   var user = data[0];
    //   done(null, user);
    // }
    // else{
    //   done(null, false);
    // }
  }
));
// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null, user._id);
})
passport.deserializeUser(function(id, done){
  // var user = passSet.passwords.filter(function(item){
  //   return item._id === id
  // })
  // done(null,user[0]);
  User.findById(id, function(err,user){
    done(err,user);
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

app.get('/', function(req,res){
  if (req.user){
    res.render('index', {user:req.user})
  }else{
    res.redirect('/login');
  }
})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}))

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){
  req.checkBody('username','You need a first name').notEmpty();
  req.checkBody('password','You need a last name').notEmpty();
  var result = req.validationErrors();
  if (result){
    res.json({error:'Cannot leave anything blank'});
  }else if (!result){
    var user = new User({
      username: req.body.username,
      hashedPassword: hashPassword(req.body.password)
    });
    user.save(function(err){
      if (err){
        res.json({error: err});
      }else{
        res.redirect('/login');
      }
    })
  }
})


app.listen(process.env.PORT || 3000);
module.exports = app;
