var express = require('express');
var router = express.Router();
var request = require('request')

var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ githubId: profile.id }, function (err, profile) {
    //   return cb(null, profile);
    // });
    cb(null, {
      token: token,
      username: profile.username
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});
passport.deserializeUser(function(username, done) {
  done(null, JSON.parse(userJson));
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE
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

router.get('/repos', function(req,res){
  request('https://api.github.com/user/repos', {
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      access_token: req.user.token
    },
    json: true
  },
    if(err){
      res.status(500).json(err);
    } else {
      res.json(body)
    }
  })
})

module.exports = router;
