var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  return router;
};


router.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.render('index', {title: 'Express'})
});


var passport = require('passport')