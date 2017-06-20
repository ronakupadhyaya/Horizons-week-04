"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var passport = require('passport');
// var passport = require('passport-local');
var auth = require('./passwords.plain.json')
var authHash = require('./passwords.hashed.json')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;







function hashPassword(password){
	var hash = crypto.createHash('sha256');
	hash.update(password)
	return hash.digest('hex');
}


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret: 'secret'}))



// app.use(passport-local)

// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connection.on('connected',function(){
	console.log('Connected to MongoDb!')
});
mongoose.connect('mongodb://dchan331:domi2462@ds133192.mlab.com:33192/vault_db')

var models = require('./models/models');


// var MongoStore = require('connect-mongo')(session)
var crypto = require('crypto');


// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)

app.use(session({
	secret: 'secret',
	store: new MongoStore({mongooseConnection: mongoose.connection})
	}
))

app.use(passport.initialize());
app.use(passport.session());
// YOUR ROUTES HERE
// PASSPORT LOCALSTRATEGY HERE

//1st time around

// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		// console.log(auth.passwords.filter(function(name){return name._id === 2})[0].username)
// 		for(var i = 0 ; i < auth.passwords.length; i ++){
// 			console.log(username, password)

// 			if (auth.passwords[i].password === password && auth.passwords[i].username === username) {
// 				console.log('succcess')

// 				return done(null, auth.passwords[i]);
//         // return done(null, false, { message: 'Incorrect username.' });
//     		}}
//     			// console.log('fail' + user.password, user.username)
//     			console.log('fail')
//     			return done(null, false);
		
// 	}
// ))

// 2nd time around
// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		var hashedPassword = hashPassword(password);
// 		for(var i = 0 ; i < authHash.passwords.length; i ++){
// 			// console.log(username, password)

// 			if (authHash.passwords[i].password === hashedPassword && authHash.passwords[i].username === username) {
// 				console.log('succcess')

// 				return done(null, auth.passwords[i]);
//         // return done(null, false, { message: 'Incorrect username.' });
//     		}}
//     			// console.log('fail' + user.password, user.username)
//     			console.log('fail')
//     			return done(null, false);
		
// 	}
// ))

// 3rd time around

passport.use(new LocalStrategy(
	function(username, password, done) {
		var hashed = hashPassword(password)
		models.User.findOne({username: username},function(err,user){
			// for(var i = 0 ; i < authHash.passwords.length; i ++){
			// // console.log(username, password)

			if (user.hashedPassword === hashed && user.username === username) {
				console.log('succcess')

				return done(null, user);
        // return done(null, false, { message: 'Incorrect username.' });
    		}
    			// console.log('fail' + user.password, user.username)
    			console.log('fail')
    			return done(null, false);

    		})
	}
	))


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user,done){
	done(null,user.id);
})

passport.deserializeUser(function(id, done) {

  models.User.findById(id, function(err, user) {
  	if(err){
  		console.log("Error in deserialize")
  		console.log(err)
  	}else{
  	console.log("User: " + user + id)
    done(null, user);
  };
})
});


// PASSPORT MIDDLEWARE HERE


app.get('/', function(req,res){
	if(!req.user){
		res.render('login')
	}else{
		res.render('index', {
			user: req.user
		});
	}
})

app.get('/login', function(req,res){
	res.render('login')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
})


app.get('/signup', function(req,res){
	res.render('signup');
})

app.post('/signup', function(req,res){
	if(req.body.username && req.body.password){
		var newbie = new models.User({username: req.body.username, hashedPassword: hashPassword(req.body.password)});
		newbie.save(function(err){
			if(err){
				console.log('Failed to add User')
			}
			res.redirect('/login');
		})
	}else{
		res.redirect('/signup');
	}
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
