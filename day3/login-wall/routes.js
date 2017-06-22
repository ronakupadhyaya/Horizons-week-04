var express = require('express');
var router = express.Router();

//EVERYTHING BELOW "THE WALL"
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
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
