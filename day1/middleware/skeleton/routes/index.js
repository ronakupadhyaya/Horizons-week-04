var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use(function (req, res, next) {
	console.log('Hello World!');
	next();
});

router.use('/hidden', function(req, res, next) {
	if (user) next();
	else {
		res.redirect('/login?redirect=hidden');
	}
});

// var handleHidden = function(req, res, next) {
// }; -----> pass this into router.get('/hidden', handleHidden, function(req, res, next) { .... })

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
  user = req.body.username;
  if (req.query.redirect) {
  	res.redirect('/' + redirect);
  } else {
  	res.redirect('/');
  }
});

module.exports = router;
