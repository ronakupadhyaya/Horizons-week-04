var express = require('express');
var router = express.Router();
var request = require('request');

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  scope: 'repo'
},
function(token, refreshToken, profile, done) {
  console.log(profile);
  done(null, {
    token: token,
    username: profile.username
  });
}));

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(userJson, done) {
  done(null, JSON.parse(userJson));
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}),
  function(req, res) {
    console.log('Successfully logged in to GitHub');
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

router.get('/repos', function(req, res) {
  request('https://api.github.com/user/repos', {
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      access_token: req.user.token
    },
    json: true
  }, function(err, response, body) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.render('repos', {
        repos: body
      });
    }
  });
});

module.exports = router;
