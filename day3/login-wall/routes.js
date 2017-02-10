var express = require('express');
var router = express.Router();


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
