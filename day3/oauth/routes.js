var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    //create credentials
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    cb(null, profile);
  }
));


//given user, pass user.username as cookies
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

//given username, give back the User object from the database.
//But in this case, it only gives back username
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/github ENDPOINT HERE
router.get('/auth/github', passport.authenticate('github'));

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

router.get('/repos'), function(req, res){
  requrest('http://api.gitub.com/user/repos'){
  }, function9err, response, body){
    if(err){
      res.status(500).json(err);
    }
    else{
      res.json(body);
    }
  }
}

module.exports = router;
