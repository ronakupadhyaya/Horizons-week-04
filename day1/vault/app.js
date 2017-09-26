"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dataBase = require('./passwords.hashed.json');
// var session = require('cookie-session');
var session = require('express-session')
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

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
  mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
// app.use(session({
//   keys: ["JamJam's little secret"],
//   maxAge: 1000*2
// }));
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


app.use(session({
  secret: 'jamjam',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})

}));

// PASSPORT LOCALSTRATEGY HERE
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     var user = null;
//     for (var i = 0; i < dataBase.passwords.length; i++){
//       if(dataBase.passwords[i].username === username && dataBase.passwords[i].password === password) {
//         user = dataBase.passwords[i];
//         return done(null, user)
//       }
//     }
//     if (user === null) {return done(null, false)}
//   }));
  passport.use(new LocalStrategy(
    function(username, password, done) {
      var hashedPassword = hashPassword(password)

      User.findOne({username: username}, function(err, user) {
        if(!user){
          console.log("f off")
        }
        else if (user.hashedPassword === hashedPassword) {
          done(null, user)
        }
        else { done(null, false)}
      })
      // var hashedPassword = hashPassword(password);
      // var user = null;
      //   for (var i = 0; i < dataBase.passwords.length; i++){
      //     if(dataBase.passwords[i].username === username && dataBase.passwords[i].password === hashedPassword) {
      //       user = dataBase.passwords[i];
      //       return done(null, user)
      //     }
      //   }
      //   if (user === null) {return done(null, false)}

    }
  )
)

    // Database.passwords.forEach(function(item) {
    //   if(item.username === username && item.password === password)
    //   {return done(null, user)}
    //   else
    //   {return done(null, false)}
    // })

//     passwords.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!passwords.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
done(null, user._id)
})

passport.deserializeUser(function(id, done){
  // var user = null;
  // for (var i = 0; i < dataBase.passwords.length; i++){
  //   if(dataBase.passwords[i]._id === id) {
  //     user = dataBase.passwords[i];
  //     done(null, user)
  //   }
  // }
  User.findById(id, function(err, user){
    if (err){
      console.log("Failed at deserializeUser")
    }
    if (user){
      done(null, user);
    }
  })
})

app.use(passport.initialize())
app.use(passport.session())





// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE
app.get('/', function(req, res) {
  if(req.user) {
res.render('index', {user: req.user})
}
else {
  res.redirect('/login')
}
})

app.get('/login', function(req, res) {
res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
)
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
})
app.get('/signup', function(req, res) {
res.render('signup')
})
app.post('/signup', function(req, res) {
  var newUser = new User({
        username: req.body.username,
        hashedPassword: hashPassword(req.body.password)
})
newUser.save(function(err){
  if (err){
    console.log("couldn't save user")
    res.send("couldn't save user")
  }
  else {
    console.log("user saved")
    res.redirect('/login')
  }
})



})
module.exports = app;
app.listen(3000)
