var express = require('express');
var router = express.Router();

// additional requirement
var request = require('request');

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
  // clientID: "108f50d45bf80c75ea1f",
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // clientSecret: "b813a0d8bede74d8a1e1a693cec056238bffab30",
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(token, refreshToken, profile, cb) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  cb(null, { // profile);
    token: token,
    username: profile.username
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE
// YOUR GET /auth/github/callback ENDPOINT HERE
router.get('/auth/github',
  passport.authenticate('github'));

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

// ADDITIONAL CODE HERE
router.get('/repos', function(req, res) {
  request('https://api.github.com/user/repos', {
    headers: { // without this header, we cannot access info
      'User-Agent': 'request'
    },
      {
        qs: {
        access_token: req.user.token
      }},
      json: true
    }
  }, function(err, response, body) {
    if(err) {
      res.status(500).json(err);
    } else {
      res.json(body);
    }
  })
});

module.exports = router;
