var express = require('express');
var router = express.Router();

router.use(function(req, res, next){ //specifying slash is equivelent to specifying nothing
  if(!req.user) {
    res.send("You are not able to view this page!");
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
  console.log("it's private");
  res.render('index', {
    user: req.user
  });
});

router.get('/secret', function(req, res) {
  console.log('SHHHHHHH secret');
  res.render('index', {
    user: req.user
  });
});

module.exports = router;
