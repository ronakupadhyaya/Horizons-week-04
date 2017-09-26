"use strict";

var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var db = require('./passwords.plain.json');
var db_hash = require('./passwords.hashed.json');
var userList = db.passwords;
var userListHash = db_hash.passwords;
var crypto = require('crypto');

function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

// Express setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


console.log('database', db);
// MONGODB SETUP HERE
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
})
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

var User = require('./models.js').User;

// SESSION SETUP HERE
var session = require('cookie-session');
app.use(session({
  keys: ['my very secret password'],
  maxAge: 100*60*2
}))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
  function(username, password, done) {
 var hashedPassword = hashPassword(password);
 User.findOne({username: username}, function(err, user){
    if (err) {
console.error(err);
return done(err);
}
if(!user){
return done(null, false)
}
if(user.password != hashedPassword) {
return done(null, false);
}
return done(null, user);
});
}
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
    done(null, user._id)
})

passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, foundUser){
if(err) {
done(err,null);
} else {
if (!foundUser){
done(null, false)
} else{
done(null, foundUser)
}
}
})
})






// PASSPORT MIDDLEWARE HERE
// app.configure(function() {
  // app.use(express.static('public'));
  // app.use(express.cookieParser());
  // app.use(express.bodyParser());
  app.use(session({
    secret: 'keyboard cat',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
//   app.use(app.router);
// });



// YOUR ROUTES HERE
app.get('/', function(req, res) {
    if (!req.user) {
      res.redirect('/login');
    }
    console.log('REQ.USER', req.user);
    res.render('index.hbs', {user: req.user})
})

app.get('/login', function(req, res) {
    console.log('get login')
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req, res) {
  res.render('signup')
})
app.post('/signup', function(req, res) {
  // // req.check('gender', 'gender must be specified').notEmpty();
  // // req.check('password', 'Password is less than 6 characters').isLength({min:6});
  // console.log('REQ.BODY', req.body)
  var newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password)
  })
newUser.save(function(err, result){
if (err){
res.send(err);
} else {
res.redirect('/login')
}
})
});


module.exports = app;
app.listen(3000, function() {
  console.log('AAAAYO');
});
