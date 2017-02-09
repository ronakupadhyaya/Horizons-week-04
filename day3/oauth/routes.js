var express = require('express');
var router = express.Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID, // read things in from my environment
    clientSecret: process.env.GITHUB_CLIENT_SECRET,

  },

  //FOR GITHUB CUZ IT CONTAINS TOKENINFO
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      done(null, profile)

  }
));

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user);
});
passport.deserializeUser(function(userJson, done) {
  done(null, Json.parse(userJson));
});
router.use(passport.initialize());
router.use(passport.session());


//WE SEND REQUEST TO GITHUB HERE
router.get('/auth/github',
  passport.authenticate('github'));

// GITHUB SENDS BACK RESPONSE HERE

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



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
