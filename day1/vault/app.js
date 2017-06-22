"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB SETUP HERE
mongoose.connection.on('connected', function() {
    console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE
app.use(session({
    secret: 'THEBESTENCODING',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(function (username, password, done) {
    var user = false;
    var data = require("./passwords.hashed.json")
    data.passwords.forEach(function (element) {
        if (element.username === username &&
            element.password === hashPassword(password)) {
            user = element;
        }
    });
    done(null, user);
}));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    var user = false;
    var data = require('./passwords.hashed.json');
    data.passwords.forEach(function (element) {
        if (element._id === id) {
            user = element;
        }
    })
    done(null, user);
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function (req, res) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        console.log(req.user);
    res.render('index', {
        user: req.user
    });
    }
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
})
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

module.exports = app;