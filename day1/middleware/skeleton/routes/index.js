var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use(function(req, res, next){	//if we dont set a response -> it will do what next says
	console.log("hello world")		//if u do res.... it will stop everything
	next();
})

router.use('/hidden', function(req, res, next){		//apply to all routes that are hidden
	if(user) next();		//if user exists then -> you found me drat! which the next /hidden function
	else{
		res.redirect('/login?redirect=hidden')
	}

	res.send("<h1>Access Denied!</h1> ")
})													//this handles the request first and won't go anywhere else bc res.send
// var handleHidden = function(req, res, next){		// this and the top are the same

// }


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {		//add handleHidden after the url part -> anything that goes through this function will also go to handleHidden funciton
  res.send("You found me! Drat!");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
//set user variable	// sent to hiddlen page or sent to slash
	user = req.body.username
	if (req.query.redirect){		//if there is a login?redirect=asdf then continue
		res.redirect('/'+req.query.redirect);
	} else{
		res.redirect('/')	//redirect to homepage
	}
  res.send("Not implemented yet");
});

module.exports = router;
	