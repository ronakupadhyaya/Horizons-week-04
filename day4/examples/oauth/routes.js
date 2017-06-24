var express = require('express');
var router = express.Router();

var passport = require('passport');
var GithubStrategy = require('passport-github')

// YOUR GITHUB STRATEGY HERE
passport.use(new GithubStrategy({
  clientID:process.env.GITHUB_CLIENT_ID,
  clientSecret:process.env.GITHUB_CLIENT_SECRET,  //typo?
  callbackURL:"http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile)
}
))

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE
router.get('/auth/github', passport.authenticate('github') )

// YOUR GET /auth/github/callback ENDPOINT HERE
router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/fail'
})
)

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
