var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(username, password, done) {
  done(null, {username: username});
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

var express = require('express');
var router = express.Router();

router.use(passport.initialize());
router.use(passport.session());


router.get('/login', function(req, res) {
  res.render('login');
});

//PUT HERE IN PASSPORT
router.use(function(req, res, next){ //use, matches on prefixes
  if(req.user){
    next();
  } else {
    res.redirect('/login')
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

module.exports = router;
