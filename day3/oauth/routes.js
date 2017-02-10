var express = require('express');
var router = express.Router();

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: 'eb72b1db9f2c16ac7356',
    clientSecret: "aa631e95db300a93e3d032e7dd468f130751b7c9",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
  cb(null,profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE

router.get('/auth/github',
  passport.authenticate('github'));

// YOUR GET /auth/github/callback ENDPOINT HERE

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

router.get('/repos', function(req, res){
  request('https://api.github.com/user/repos', {
    headers: {
      'User-Agent':'request'
    },
    as: {
      
    }
  }, function(err, response, body){
    if(err){
      res.status(500).json(err);
    } else{

    }
  })
})

module.exports = router;
