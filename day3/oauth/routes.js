var express = require('express');
var router = express.Router();
var request = require('request')
var passport = require('passport');

// YOUR GITHUB STRATEGY HERE
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'about'],
    scope: ['email','user_about_me']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("=================")
    console.log(profile);
    // User.find({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null,profile);
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(username, done) {
  done(null, {username: username});
});
router.use(passport.initialize());
router.use(passport.session());

// YOUR GET /auth/facebook ENDPOINT HERE
router.get('/auth/facebook',
  passport.authenticate('facebook'));

// YOUR GET /auth/facebook/callback ENDPOINT HERE
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
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
  console.log(`++++++++++++++++++++++=`)
  console.log(req.user)
  if (req.user) {
    res.render('index', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/repos', function(req,res){
  request('https://api.facebook.com/user/repos', {
    headers: {
      'User-Agent': 'request'
    },
    qs:{
      access_token: req.user.token
    }
  }, function(err,response,body){
    if(err){
      res.status(500).json(err);
    }else{
      res.json(body)
    }
  }
  )
})


module.exports = router;
