var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) res.redirect('/login');
    res.render('index',{title:"You are Logged In!"});
  });
  return router;
};
