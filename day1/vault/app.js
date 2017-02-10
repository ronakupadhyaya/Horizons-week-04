"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var readjson = require('./passwords.plain.json');
var readhash = require('./passwords.hashed.json');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require ('crypto');
var expressValidator = require('express-validator');
var User = require('./models.js');

// var session = require('cookie-session');

var port = 3000;




// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//hashPassword
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDb bitch!');
})
mongoose.connect('mongodb://bryan:bryan@ds145039.mlab.com:45039/focus')

app.use(session({
  secret: 'your secret here',
  store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}));
// app.use(session({secret: 'your fucking secrets here'}));

//put app below setup bc I declared var app= express
// app.use(session({
//   keys:['my very secret password'],
//   maxAge: 10000
// }));


passport.use(new LocalStrategy(
function(username, password, done){
  models.User.findOne({username: username}, function(err,user){
    if (err) {
      // res.render('register', {errors: errors});
      console.log("BOYYY ERROR")
    } else {
        if(user.password === password){
          done(null,user);
        }
        else{
          done(null,false);
        }
    }
  })
}));

// passport.use(new LocalStrategy(
//   function(username, password, done){
//     var hashedPassword = hashPassword(req.body.password);
//       for(var i = 0; i<readhash.passwords.length; i++){
//         if(req.body.username === readhash.passwords[i].username && req.body.password === readhash.passwords[i].password){
//           done(null, readhash.passwords[i])
//           return;
//         }
//       }
//       //can't done(null,false) inside because it will just call done a lot
//       done(null,false);
//   }));

// passport.use(new LocalStrategy(
//   function(username, password, done){
//
//     // Mongoose: User.findOne({ username: readjson.username }, function (err, user) {
//     for(var i =0; i<readjson.passwords.length;i++){
//       // console.log(readjson.passwords.username);
//       if(username === readjson.passwords[i].username && password === readjson.passwords[i].password){
//           done(null, readjson.passwords[i]);
//           return;
//           //to get that object containing username and password
//       }
//
//     }
//       done(null,false);
//   }));



// passport.use(new LocalStrategy(
//   function(username, password, done) {
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








//PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
  // user is a variable passed into a function
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  //find ID and return the object
  models.User.findbyID(id,function(err,user){
    if (err) {
      // res.render('register', {errors: errors});
      console.log("You got another error bitch")
    } else {
        done(null,user);
    }

  });


});

// passport.deserializeUser(function(id, done){
//   readjson.passwords.forEach(function(item){
//     if(id === item._id){
//       done(null,item);
//     }
//   });
// });


  //var user = readjson.passwords;

  //user is the object. To get to that object it's readjson.password



// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE

//route GET and render index.hbs

//Signup
app.use(expressValidator());

app.get('/signup',function(req,res){
  res.render('signup');
  //render, not redirect
});

function validate(n) {
  //n doesn't mean anything
  n.checkBody('username', 'Invalid username').notEmpty();
  n.checkBody('password', 'Invalid password').notEmpty();
}
app.post('/signup',function(req,res){
//validate the request
  validate(req);

  //make a new instant of a model var something = new user
  var newuser = new User;
  //
  var errors = req.validationErrors();
  if (errors) {
    // res.render('register', {errors: errors});
    console.log("You got an error bitch")
  } else {
    newuser.save();
    res.redirect('/login')
  }

  //res.redirect('/login');
});


// Login

app.get('/login',function(req,res){
  console.log("login");
  res.render('login')

})


app.get('/',function(req,res){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    res.render('index',{user:req.user});
  }

  //res.render('index')
});

//Logout:
app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

//Route GET and render login.hbs



app.post('/login',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}))




// app.listen(3000, function() {
//   console.log("Example app listening on port 3000!");
// });

//Don't need to do app.isten here because we set the app to listen to port 3000 in ./bin/www


//App.use cookie-session


module.exports = app;
