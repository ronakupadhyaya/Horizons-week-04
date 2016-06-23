var express = require('express');
var router = express.Router();

// Require login past this point.
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // Your code here.
  res.render('index');
});

module.exports = router;
