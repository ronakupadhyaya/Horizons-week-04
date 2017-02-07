"use strict";



var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passwordData = require('./passwords.hashed.json');
var crypto = require('crypto');
var User = require('./models/models');
// var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connect('mongodb://junjiejiang:justdoit123!@ds139879.mlab.com:39879/junjiehorizons');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


function hashPassword(password){
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

passport.use(new LocalStrategy( function(username, password, next) {
  var hashedPassword = hashPassword(password);
     
     User.findOne({ username: username }, function (err, user) {
      if (err) { return next(err); }
      if (!user) {
        return next(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== hashedPassword) {
        return next(null, false, { message: 'Incorrect password.' });
      }
      return next(null, user);
    });



    // passwordData.findOne({ username: username }, function (err, user) {
    //   if (err) { return next(err); }
    //   if (!user) {
    //     return next(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (user.password != password) {
    //     return next(null, false, { message: 'Incorrect password.' });
    //   }
    //   return next(null, user);
    // });


  }
));
// MONGODB SETUP HERE


// SESSION SETUP HERE
app.use(session({
	secret: 'passwordfather',
	store: new MongoStore({ mongooseConnection: require('mongoose').connection})
}));
// PASSPORT LOCALSTRATEGY HERE
passport.serializeUser(function(user, done){
	return done(null, user._id);
});


passport.deserializeUser(function(id, cb) {

   User.findById(id, function (err, user) {
   	if(err){
   		return cb(err)
   	}
   	return cb(null, user);
   });


});

app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
app.get("/", function(req, res){
	if(!(req.user)){
		res.redirect('/index')
	}
	
	res.render("index", {user: req.user});
});
app.get("/login", function(req, res){

	res.render("login");
});
app.post("/login", passport.authenticate('local',{
	successRedirect: "/",
	failureRedirect: "/login"
}));


app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/login");

});

app.get('/signup', function(req, res){
	res.render("signup");
});

app.post('/signup', function(req, res){
req.checkBody('usernme', 'username is required').notEmpty();
req.checkBody('password', 'password is required').notEmpty();
User.findOne({username: req.body.username}, function(err, user){

if(user !== null){
	res.status(300).json({"Error" : "username already exist"});
}else{
	  var newUser = new User ({
      username: req.body.username,
      password: hashPassword(req.body.password),
    });
   
   newUser.save(function (err){
   	if(err){
    res.status
   	}else{
   	res.redirect('/login')
   }
  });
 }

});

 
});

module.exports = app;

app.listen("3000")