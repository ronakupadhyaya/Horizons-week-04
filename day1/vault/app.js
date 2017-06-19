"use strict";

var express       = require('express'),
    path          = require('path'),
    logger        = require('morgan'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    localDB       = require('./passwords.hashed.json').passwords,
    // session       = require('cookie-session'),
    session       = require('express-session'),
    MongoStore    = require('connect-mongo')(session),
    mongoose      = require('mongoose'),
    crypto        = require('crypto'),
    User          = require('./models/models.js').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Hashing Function
function hashFunction(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest("hex");
}

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
  console.log("Connected to Mongo :)");
});
mongoose.connect("mongodb://admin:pass@ds131492.mlab.com:31492/passport");
// SESSION SETUP HERE
app.use(session({
  secret:"my secrets suck lol",
  store: new MongoStore({mongooseConnection: mongoose.connection})}));
// PASSPORT LOCALSTRATEGY HERE


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        done(err, false);
      } else if (user === null) {
        done(null, false, {message: 'Incorrect username'})
      } else {
        if (user.password === hashFunction(password)) {
          done(null, user);
        } else {
          done(null, false, {message: "Incorrect Password"})
        }
      }
    })
    
    
  }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(null, user);
  })
})

// PASSPORT MIDDLEWARE HERE

app.use(passport.initialize());
app.use(passport.session());



// YOUR ROUTES HERE
app.get("/", function(req, res){
  if (req.user) {
    res.render("index", {user: req.user});
  } else {
    res.redirect("/login");
  }
  
});

app.get("/signup", function(req, res) {
  res.render("signup");
})

app.post("/signup", function(req, res) {
  var user = new User({username: req.body.username, password:hashFunction(req.body.password)});
  user.save();
  res.redirect("/login");
})

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})
module.exports = app;
