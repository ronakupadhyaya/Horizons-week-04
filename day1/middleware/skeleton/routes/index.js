var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

//This is the first thing that handles the request.  s
router.use(function(req,res,next) {
	console.log("intercepted");
	//necessary to call next because otherwise you're never going to the
	//next response, nor would you ever be stopping 
	next();
})
//one way to do this. Another way to do this would be to make a function
// that takes in req res and next, set it to a variable, and cal it as a
// parameter into one of the routes below, right before the function in that
// and after the location in dex slash thing
router.use('/hidden', function(req, res, next) {
	if (user) {
		//will take you to the next route for hidden
		next();
	} else {
		res.redirect('/login?redirect=hidden');
	}
	res.send("<h1>Access denied!</h1>")
	//don't call next because' we're using send
})
// ^^ THIS handles the request before that router.get below. Happens before
// the regular routers. So like, if user is logged in, do this, else do that. 
// Shows how to handle requests. 

// If they're not logged in, we need to intercept the hidden part. They could
// either proceed, going to next, or direct to login page which will 
// redirect them after they login. 

// Store data in URL through query string. Property in a query string to redirect
// to a URL.

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {
  res.send("You found me! Drat!");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  // This is where we set the user variable
  user = req.body.username;
  // they're logged in. Where do we send them?
  // checking if they're posting with a redirect in their url
  // req.query.redirect is just a string that was partof our url 
  if (req.query.redirect) {
  	res.redirect('/' + req.query.redirect);
  } else {
  	res.redirect('/');
  }
});

module.exports = router;
