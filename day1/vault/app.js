"use strict";
//var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport') ,
 localStrategy = require('passport-local').Strategy;

 var db = require('./passwords.hashed.json');

 var session = require('express-session');
 var MongoStore = require('connect-mongo')(session);
 var hashPassword = require('./hashpassword');



// Express setup
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "your secret key here",
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// MONGODB SETUP HERE

var mongoose = require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('connected to mongo db!');
});
mongoose.connect('mongodb://reed:reed@ds133192.mlab.com:33192/registration-rf')

//hash passwords



// PASSPORT LOCALSTRATEGY HERE
// passport.use(new localStrategy(
//   function(username, password, done) {
//     var hashedPassword = hashPassword(password)
//     for (var i=0; i<db.passwords.length; i++) {
//       if (db.passwords[i].password === hashedPassword) {
//         if(db.passwords[i].username === username) {
//             done(null, db.passwords[i]);
//         }
//       }
//     }
//     done(null, false);
//   }
// ));

// hashed mongo LocalStrategy

passport.use(new localStrategy(function (username, password, done) {
    var hash = hashPassword(password);

    // Find the user with the given username
    models.User.findOne({username: username}, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, {message: 'Incorrect username.'});
      }
      // if passwords do not match, auth failed
      if (user.password !== hash) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function(id, done) {
//   for (var i = 0; i < db.passwords.length; i++) {
//     if (db.passwords[i]._id === id) {
//       done(null, db.passwords[i]);
//     } // adds req.user you can check later if req.user is there, if they are they are in a session
//   }
// });

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if (!req.user){
    res.redirect('/login');
  }
  if (req.user){
    res.render('index', { user: req.user });
  }

});

app.get('/login', function(req, res) {
  res.render('login');

});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  var password;
  // Unhashed version
  // password = req.body.password;
  // Hashed version
  password = hashPassword(req.body.password);

  var u = new models.User({
    username: req.body.username,
    password: password
  });
  u.save(function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).redirect('/register');
      return;
    }
    console.log(user);
    res.redirect('/login');
  });
  return router;
});




module.exports = app;
app.listen(3000);
