var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'a tiny site'});
  });  
  
  return router;
};
