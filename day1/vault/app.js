"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var models = require('./models/models')
var User = models.User

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var userArr = require('./passwords.hashed.json')

// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function() {
    console.log('Connected to MongoDb!')
})
mongoose.connect(process.env.MONGO_URI)

// SESSION SETUP HERE
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
    secret: 'our secret is here',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))

// PASSPORT LOCALSTRATEGY HERE
passport.use(new LocalStrategy(
    function(username, password, done) {
        var hashed = hashPassword(password)
        User.findOne({username: username, hashedPassword: hashed}, function(err, user) {
            if (err) {
                console.log(err)
            } else {
                if (! user) {
                    return done(null, false)
                } else {
                    return done(null, user)
                }
            }
        })


        // // console.log(userArr)
        // var seenFlag = false
        // var userObj;
        // userArr.passwords.forEach(function(user) {
        //     if ((user.username === username) && (user.password === hashPassword(password))) {
        //         seenFlag = true
        //         userObj = user
        //     }
        // })
        // // console.log(userObj)
        // if (seenFlag) {
        //     return done(null, userObj)
        // } else{
        //     return done(null, false)
        // }
    }
));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done){
    // console.log('user, user._id');
    // console.log(user, user._id)
    done(null, user._id)
})
passport.deserializeUser(function(id, done) {
    console.log(id)
    User.findById(id, function(err, user) {
        console.log('findbyID', user);
        if (err) {
            console.log(err)
        } else {
            done(null, user)
        }
    })
    // var answer;
    // for(var i=0; i < userArr.passwords.length; i++){
    //     if (userArr.passwords[i]._id === id) {
    //         answer = userArr.passwords[i];
    //         break;
    //     }
    // }
    // done(null, answer);
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize())
app.use(passport.session())

var crypto = require('crypto');
function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

// YOUR ROUTES HERE
app.get('/', function(req, res) {
    // console.log('req.user', req.user);
    if (!req.user) {
        res.redirect('/login');
    } else {
        res.render('index', {user: req.user});
    }
})

app.get('/login', function(req, res) {
    // console.log('hello')
    res.render('login')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })
)

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

app.get('/signup', function(req, res) {
    res.render('signup')
})

app.post('/signup', function(req, res) {
    var pword = hashPassword(req.body.password)
    var uname = req.body.username
    if (pword && uname) {
        var newUser = new User({
            username:uname,
            hashedPassword: pword
        })
        newUser.save(function(err) {
            if (err) {
                console.log('New user not saved properly.')
            }
        })
        res.redirect('/login')
    } else {
        res.redirect('/signup')
    }

})

module.exports = app;
