// imports n' things
var router = require('express').Router();

module.exports = function(passport) {
	router.get('/register', function(req, res, next){
		res.render('/views/register.bhs');
	})
  
  
  
  return router;
};
