var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  if(req.user) {
    next()
  }
  else {
    console.log('please log in')
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

router.post('/walter', function(req, res) {
  Secret.find({
    'secret': {
      "$ne": "moose"
    }}, function (err, secret) {
      res.json(secret)
    }
  )
})

module.exports = router;
