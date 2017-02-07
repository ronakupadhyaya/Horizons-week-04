#!/usr/bin/env node
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var exphbs = require('express-handlebars');
var app = express();
var port = '3000'
var expressValidator = require('express-validator');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;


// Set your MongoDB connect string through a file called
// config.js or through setting a new environment variable
// called MONGODB_URI!
var db = process.env.MONGODB_URI || require('./config').db;

var mongoose = require('mongoose');
mongoose.connect(db);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.set('port', port);
app.listen(port);


//Check password in password.hashed.json
var passwordhash = require('./passwords.hashed.json');

passport.use(new LocalStrategy(

  function(username, password, done) {
    passwordhash.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

var password

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true
  function(req,res){
    res.redirect();
  }
}))
