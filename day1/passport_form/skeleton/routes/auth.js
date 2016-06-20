<<<<<<< Updated upstream
// imports n' things
var router = require('express').Router();
=======
var express = require('express');
var router = express.Router();
>>>>>>> Stashed changes

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get("/register", function(req, res, next){
  	res.render("../views/register.hbs");
  });
  
  
  return router;
};
module.exports = router;