"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')


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
	console.log("connected to mongodb");
});
mongoose.connect('mongodb://james:test@ds131782.mlab.com:31782/week4_login')

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

app.use(session({secret: 'your secret here',
				 store: new MongoStore ({mongooseConnection: mongoose.connection})
}))



// PASSPORT LOCALSTRATEGY HERE
var password_plain = require('./passwords.plain.json') //JSON object of passwords
var password_hashed = require('./passwords.hashed.json')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

// HASHING PASSWORD
var crypto = require('crypto');
function hashPassword(password){
	var hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest('hex')
}

passport.use(new LocalStrategy(function(username, password, done) {
	// Look through the passwords.plain/hashed.json file for given username/passwords
	var hashedPassword = hashPassword(password);
	for (var i = 0; i< password_hashed['passwords'].length;i++){
		var user = password_hashed['passwords'][i];

		if (user.username === username & user.password === hashedPassword){

			return done(null, user);
		}
	}
	//false tells passport that this log in attempt was not successful
	return done(null, false);
}));






// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
	var user = User.findbyId(id, function(err){
		if (err){
			console.log('error')
		}
	})
	done(null, user)
})


// PASSPORT MIDDLEWARE HERE




// YOUR ROUTES HERE

module.exports = app;

app.get('/',function(req,res){
	if (req.user){
		res.render('index.hbs',{user: req.user})
	} else{
		res.redirect('/login')

	}
	
})

app.get('/login',function(req,res){
	res.render('login.hbs');
});

app.post('/login', passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
})

app.get('/signup'){
	res.render('signup.hbs')
}

app.post('/signup'{
	req.checkBody('username', 'Invalid username').notEmpty();
	req.checkBody('password', 'Invalid password').notEmpty();

	var newUser = new User({
		username: req.body.username,
		password: req.body.password
	})

	newUser.save(function(err){
		if(err){
			resp.send('ERROR!');
		} else{
			resp.send('SUCCESS!');
		}
        
	})
})

app.listen(3000, function(){
	console.log("Yay, it connected")
})
