var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  if (req.user) {
    next()
  }
  else {
    res.redirect('/login')
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
