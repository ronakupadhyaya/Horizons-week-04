"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var passwords = require('./passwords.plain.json').passwords;
var passwords = require('./passwords.hashed.json').passwords;
// var session = require('cookie-session');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');
var User = require('./models/models');

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
mongoose.connection.on('connected', function(){
	console.log('Connected to MONGODB');
});
// mongoose.connect('mongodb://dnajafi:9215WmLa@ds047458.mlab.com:47458/vault');

var connectStr = 'mongodb://dnajafi:9215WmLa@ds047458.mlab.com:47458/vault';

var connect = connectStr;
mongoose.connect(connect);

// SESSION SETUP HERE
app.use(session({
	secret: 'your secret here',
	store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// app.use(session({
// 	keys: ['my very secret password'],
// 	maxAge: 1000*60*2
// }));

var hashPassword = function (password){

	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex');

}


// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
	function(username, password, done){


		User.findOne({username: username}, function(err, user){

			if(err){
				console.log(err);
				return done(err);
			}

			if(!user){
				return done(null, false, {message: "Username incorrect"});
			}

			var hashedPassword = hashPassword(password);
			hashedPassword = hashedPassword + "";

			if(user.password !== hashedPassword){
				return done(null, false, {message: 'Incorrect password.'});
			}

			return done(null, user);


		});

		// var hashedPassword = hashPassword(password);

		// for(var i=0; i<passwords.length; i++){
		// 	if(username === passwords[i].username && hashedPassword === passwords[i].password){
		// 		return done(null, passwords[i]);
		// 	}
		// }
		// return done(null, false);
	}
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {

	done(null, user._id);

});

passport.deserializeUser(function(id, done){


	User.findById(id, function(err, user){

		done(err, user);

	});

	// for(var i=0; i<passwords.length; i++){

	// 	if(passwords[i]._id === id) {
	// 		done(null, passwords[i]);
	// 		return;
	// 	}
	// }

	// done(null, false);

});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE


app.get("/", function(req, res){

	//res.render("index");
	console.log(req.user);
	// res.render('index');
	// return;
	if (! req.user) {
		res.redirect("/login");		
	} else{
		res.render('index', {user: req.user});
	}

});

app.get("/login", function(req, res){

	res.render("login");

});

app.get("/logout", function(req, res){

	req.logout();
	res.redirect('/');

});



app.post("/login", passport.authenticate('local', {

	successRedirect: '/',
	failureRedirect: '/login'

}));

app.get("/signup", function(req, res){

	res.render("signup");

});

app.post("/signup", function(req, res){

	if(req.body.username!== "" && req.body.password !== ""){

		var hashedPassword = hashPassword(req.body.password);

		var newUser = new User({
			username: req.body.username,
			password: hashedPassword 

		});


		// console.log(newUser);

		// console.log(newUser.name);
		// console.log(req.body.username);

		newUser.save(function(err) {
		    if (err) {
		      res.status(500).json(err);
		    } else {
		      //res.send('Success: created a a new user');
		      res.redirect("/login");
		    }
	  	});

	}

});






module.exports = app;
// app.listen(3000);
