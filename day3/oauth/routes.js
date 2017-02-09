var express = require('express');
var router = express.Router();

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: "c0bee982c41669f90a9e",
    clientSecret: "b35a92c209ae66e97b90d5738fa3d395c374e135",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    cb(null, profile);
    //JUST LIEK WRITING DONE()
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
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


//get repos

router.get('/repos', function(req, res) {
  request('https://api.github.com/user/repos', {
    headers: {
      'User-Agent': "request"
    },
    
  })
})

module.exports = router;
