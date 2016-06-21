var router = require('express').Router();

module.exports = function(passport) {
  /* GET home page. */
router.get('/', function(req, res) {
  if (!req.isAuthenticated()) 
  {
  	console.log("WHY IS THIS NOT WORKING");
    res.redirect('/login');
    
  }
  	else
	  {
		 res.render('index', { title: 'Express' });
	  };
});
return router;
};
