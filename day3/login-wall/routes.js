var express = require('express');
var router = express.Router();

//SOLUTION HERE
router.use(function(req, res, next){
  if(req.user){
    next();
  } else {
    res.redirect('/login');
  }
});
//SOLUTION ABOVE
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
