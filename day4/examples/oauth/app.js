var express = require('express');
var path = require('path');
var passport = require('passport');

var app = express();
var hbs = require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');

var session = require('cookie-session');
app.use(session({keys: ['some private info']}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));


app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
