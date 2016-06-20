// imports n' things
var router = require('express').Router();

module.exports = function(passport) {
  // YOUR CODE HERE
 passport.get('/register', function(res,req){
  	res.render('../views/register')
  })
  
  
  return router;
};
