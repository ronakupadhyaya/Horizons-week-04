"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passwordObj = require('./passwords.plain.json')
var hashedObj = require('./passwords.hashed.json')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/models').User
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto');



// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!');
});
mongoose.connect('mongodb://quinntinruiz:Mtrwe513@ds133162.mlab.com:33162/vaultqr')


// SESSION SETUP HERE
// var session = require('cookie-session');
// app.use(session({
//   keys: ['my very secret password'],
//   maxAge: 10000
// }));

app.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}



app.use(passport.initialize());
app.use(passport.session());

passport.deserializeUser(function(id,done){ //check again
  User.findById(id, function(err, user){
    if(err || !user){
      done(null,false);
    } else{
      done(null, user);
    }
  });


//send user over passport
// var user = null;
// for (var i = 0; i < passwordObj['passwords'].length; i++){
//   if(passwordObj["passwords"][i]['_id'] === id){
//     user = passwordObj["passwords"][i];
//   }  //find the user id in the passwords json file
// }
});

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy( function(username, password, done) {
  //look through passwords.plain/hashed.json file for the given username and password
  User.findOne({username: username}, function(err,user){
    // console.log(user)
    if(err){
      return done(err);
    }
    if(!user){
      console.log('incorrect username')
      return done(null,false, {message:"incorrect username"});
    }
    if(user.password !== hashPassword(password)){
      console.log('incorrect password');
      return done(null, false, {message: "Incorrect password"})
    } else{
      console.log('valid');
      done(null, user);
    }
  });
}))

      // var hashedPassword = hashPassword(password);
      // for(var i = 0; i < hashedObj['passwords'].length; i++) {
      //   if(hashedObj["passwords"][i].username === username && hashedObj["passwords"][i].password == hashedPassword){
      //     return done(null, hashedObj['passwords'][i]);
      //   }
      // }
      // //if password and username are valid
      // return done(null, false);


//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));



// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user,done){
  done(null, user._id);
})


// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req,res){
  if(req.user){
  res.render("index.hbs", {user: req.user})
} else{
  res.redirect('/login');
}

})

app.get('/login', function(req,res){
  res.render("login.hbs")
})

app.post('/login', passport.authenticate('local', {
  successRedirect:'/',
  failureRedirect: '/login'
}))

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req,res){
  res.render('signup.hbs');
})

app.post('/signup', function(req,res){
  ///validate username and password from req.body.
  if(req.body.username && req.body.password){
    var newUser = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
    })
    newUser.save(function(err, user){
      if(err){
        console.log('Error! Could not save user' );
      } else{
        res.redirect('/login')
      }
    })
  //if pass, create new user Object and .save() to MongoDB
  }
})


module.exports = app;

app.listen(3000);
