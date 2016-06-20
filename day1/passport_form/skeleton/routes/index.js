var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res) {
    if(!req.isAuthenticated()) {
    	console.log("not logged in!!");
    	res.redirect('/login');
    } else {
    	res.render('index', { title: 'Super secret page' });
    }
  });
  
  return router;
};
