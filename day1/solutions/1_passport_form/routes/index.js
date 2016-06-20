var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', passport.authenticate('local'), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
