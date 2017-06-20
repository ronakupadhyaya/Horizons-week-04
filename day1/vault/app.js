"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models')
var User = models.User;

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
    console.log('CONNECTED TO DATABASE');
});
mongoose.connect('mongodb://nicksspark:password@ds133192.mlab.com:33192/thevault');

// SESSION SETUP HERE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'secret',
    store: new MongoStore({
        mongooseConnection: require('mongoose').connection.on('connected', function() {
            console.log('NEW SESSION');
        })
    })
}));

//hashing
var crypto = require('crypto');
function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

// PASSPORT LOCALSTRATEGY HERE
/*var users = require('./passwords.plain.json');
var hashedUsers = require('./passwords.hashed.json');*/

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(user.hashedPassword === hashPassword(password)) {
                done(null, user);
            } else {
                done(null, false);
            }

        })

        /*var hashedPassword = hashPassword(password);
        var usersArr = hashedUsers.passwords;
        var user;
        usersArr.forEach(function (element) {
            if (element.username === username && element.password === hashedPassword) {
                user = element;
            }
        });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }*/
    }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function (user, done) {
    done(null, user._id);
    return;
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        done(null, user);
        return;
    })
    /*var usersArr = users.passwords;
    var user;
    usersArr.forEach(function (element) {
        if (element._id === id) {
            user = element;
        }
    });*/
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// YOUR ROUTES HERE
app.get('/', function (req, res) {
    if (!req.user) {
        res.redirect('/login');
    }
    else {
        res.render('index', {
            user: req.user
        })
    }
})

app.get('/login', function (req, res) {
    res.render('login');
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
    res.render('signup');
})

app.post('/signup', function(req, res) {
    var password = hashPassword(req.body.password);
    var u = new User({
        username: req.body.username,
        hashedPassword: password
    });
    u.save(function(err) {
        res.redirect('/login');
    })
})

module.exports = app;
