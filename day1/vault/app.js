"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var User = require('./models/models.js').User;

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Validator configuration
app.use(validator());


// MONGODB SETUP HERE
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connect', function() {
    console.log('Connected to MongoDb!');
});

// SESSION SETUP HERE
// var session = require('cookie-session'); // -> not secure enough
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// // cookie-session is not secure enough
// app.use(session({
//     keys: ['hey hacker'],
//     maxAge: 1000*60*2 // controls how much we want a user to relogin
//     // by default, maxAge is set to expire when session ends
//     // for now: 2 minutes
//     // must create session before serializing/deserializing
// }));

app.use(session({
    secret: 'shh this is a secret',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// var Users = require('./passwords.plain.json')
var HashUsers = require('./passwords.hashed.json')

passport.use(new LocalStrategy(
    function(username, password, done) {
        var validUser = false;
        var validPass = false;
        var userAuth;
        var hashedPassword = hashPassword(password);

        User.findOne({username: username, }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: 'Incorrect username.'}); }
            if (!(user.hashedPassword === hashedPassword)) { return done(null, false, {message: 'Incorrect password.'})}
            return done(null, user);
        })

    }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id,done) {
    var user;
    // HashUsers.passwords.forEach(function(userFor) {
    //     if (userFor._id === id) {
    //         user = userFor;
    //     }
    // })
    // done(null, user)
    console.log(id);
    User.findById(id, function(err, user) {
        console.log(user);
        done(null, user)
    })
});


// PASSPORT MIDDLEWARE HERE
  app.use(passport.initialize());
  app.use(passport.session());

// PASSWORD HASHING
var crypto = require('crypto');
function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

// YOUR ROUTES HERE
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/login');
    }
    else {
        res.render('index', {
            user: req.user
        })
    }
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

app.get('/signup', function(req, res) {
    res.render('signup');
})

app.post('/signup', function(req, res){
    var username = req.body.username;
    var hashedPassword = hashPassword(req.body.password);
    req.checkBody('username', 'Username required.').notEmpty();
    req.checkBody('password', 'Password required.').notEmpty();
    var err = req.validationErrors();
    if (err) {
        console.log("Error!"+err);
    }
    else {
        var user = new User({
            username: username,
            hashedPassword: hashedPassword
        })
        user.save(function(err) {
            if (err) {
                res.status(500).json(err);
            }
            else {
                console.log("Success! You successfully registered.")
                res.redirect('/login')
            }
        });
    }
})

app.listen(process.env.PORT || 3000);

module.exports = app;
