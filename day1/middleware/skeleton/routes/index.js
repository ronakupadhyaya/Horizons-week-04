var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;
///way to say that by default, nobody is logged in

// Your middleware goes here.
// CAREFUL! Order matters!
router.use(function(req,res,next){
	//next: function that goes to next piece or middleware with the same requests
	console.log("Hello World")
	//using res stops the response.... you can't send after you've already sent (the response closes the chain)
	//this is the thing that first handles the request
	next(); ///call to be passed allong/ handles to subsequent middleware
	//next says keep passing along

});
//handle wherever we are with 3 parameters.... req, res, and next

//passport is just middleware, allowns for us an extra step to check

//using router.get intstead of router.use will make it apply to any get, but not the posts as well
// can also pass functions in as middleware, directly into the router.get (etc) calls... same as router.use, just in a 
//different syntax

//make sure you don't call next if you shouldn't... wen you respond generally do not call next, only sinlge place for response in each request
// as soon as somebody handles it, nobody else should be able to do it

//can check if there is a req.query, and if so login and redirect, otherwise
//send back to the home page

router.use('/hidden', function(req,res,next){
	if(user){
		next(); //if there is a user, rdirect them to the next step
		//next goes to the next route within THIS URL CHAIN
	}
	res.redirect('/login?redirect=hidden')
	// no next action, dead end because of way defined (no next after this pt, doesn't dontinue to any other hiddenware
	//using this route)
	//can access this info in another window through rec.query.redirect
})



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
  // Your code here
  user=req.body.username; //set variable to log them in
  //check for query string
  if(req.query.redirect){ //just string that was originally i url
  	//when actually redirecting, it is the response
  	res.redirect('/'+req.query.redirect);
  }
  else{
  	res.redirect('/')
  }
});

module.exports = router;
 
//passport stores info to each user, specific to each request (instead of
//being set to one var)

//res.redirect: will not render template, just go to different middleware to 
//handle elsewhere... handled by aother request to render (to change the 
//route from /hidden to /login)

//for every page, have a function to render page, but going in btw pages
//should always redirect to those pages...starts another request 
//redirect starts a new request from the browser

//query limited in size, usually send objects through post