var express = require('express');
var router = express.Router();



///this is our code
router.use(function(req, res, next){
  if(req.user){
    next();
  } else{
    res.redirect('login');
  }
})
//that order matters
//could also put it inside of passport after login

//
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
