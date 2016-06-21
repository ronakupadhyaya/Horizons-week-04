var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
	router.get('/', function(req, res) {
	  if (!req.isAuthenticated()) {
	    res.redirect('/login');
	  }
	  res.render('index');
	});
  
  return router;
};
