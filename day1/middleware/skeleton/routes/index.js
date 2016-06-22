var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use(function(req, res, next) {
	console.log('client request detected');
	next();
})

router.get('/', function(req, res, next) {
	var sess = req.session;
	console.log();
	console.log();

	if(sess.count) {
		res.render('index', { title: "I've seen you before"});
		sess.count++;
	} else {
		sess.count = 1;
		res.render('index', {title: "You are new"})
	}

  	
});

router.get('/hidden', function(req, res, next) {
  res.send("You found me! Drat!");
  next();
  // res.redirect('/msg');
});

router.use(function(req, res, next) {
	res.send('access denied');
})

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  // Your code here
  res.send("Not implemented yet");
});

module.exports = router;
