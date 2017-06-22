var express = require('express');
var router = express.Router();

//MIDDLEWARE
router.use(function(req, res, next) {
  if (req.user) {  //if logged in, let it through
    next();
  }
  else { //if not logged in, redirect to login page
    res.redirect('/login');
  }
});

router.get('/', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/private', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/secret', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

module.exports = router;
