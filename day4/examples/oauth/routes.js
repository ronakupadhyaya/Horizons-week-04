var express = require('express');
var router = express.Router();

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/fb/login/callback'
},
function(accessToken, refreshToken, profile, done) {
  done(null, {
    token: accessToken,
    name: profile.displayName,
    id: profile.id
  });
}));

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
