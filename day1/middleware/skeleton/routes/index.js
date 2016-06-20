var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!
router.use(function(req, res, next){
	console.log('something')
	next();
});
// router.use('/hidden',function(req,res,next){
// 	res.send('Acces denied')
// });
router.use('/hidden', function(req, res, next){
	if(user) next();
	else{
		res.redirect('/login?redirect=hidden');
	}
});



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
  // this is when we set the user variable
  user = req.body.username;
  if(req.query.redirect){
  	res.redirect('/' + req.query.redirect);
  } else{
  	res.redirect('/');
  }
});

module.exports = router;



// Start by writing a simple middleware function that prints something to the console every time it intercepts a request.
// Now, write a middleware function that prints the message "Access denied" if a user tries to access the /hidden route.
// Next, write a middleware function that requires a user to log in if they're not already logged in. For now, just store 
// the login information in a variable in index.js. If the user isn't logged in yet, you should redirect them to a login form, 
// and keep track of the page the user tried to visit. After they log in using the form, redirect them back to the page they 
// originally tried to access.
// Finally, let a user access /hidden only if they've logged in. If not, they should continue to see "Access denied."