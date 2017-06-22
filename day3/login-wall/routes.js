var express = require('express');
var router = express.Router();

router.use('/', function(req, res, next){
  if(req.user) {
    next();
  } else {
    res.send('You are not logged in. You should not be able to view this page!')
  }
})

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
