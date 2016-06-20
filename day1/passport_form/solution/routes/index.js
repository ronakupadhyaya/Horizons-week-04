var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function(passport) {
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    console.log(req.isAuthenticated());
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }
    res.render('index', { title: 'Express' });
  });
  
  return router;
}
