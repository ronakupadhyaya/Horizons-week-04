var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
  //you can also specify '/' before the function, it will still work
  if(!req.user){
    res.redirect('/login');
  } else {
    next();
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
