var express = require('express');
var app = express();
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!
router.use( function(req, res, next) {
	if (!user) {
		res.render('login');
		user = 1;
	} else {
		console.log(req.originalUrl)
	}
	next();
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
  res.send("Not implemented yet");
});

module.exports = router;
