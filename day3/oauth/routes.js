var express = require('express');
var router = express.Router();

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(token, refreshToken, profile, done) {
      done(null, {
        token: token,
        username:profile.username
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(userJson, done) {
  done(null, Json.parse(userJson));
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      cb(null, profile);
  }
));

router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


// YOUR GET /auth/github/callback ENDPOINT HERE

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});


router.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});


module.exports = router;
