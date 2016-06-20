var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use('',function(req,res,next) {
	console.log('request noticed')
	if (req.url!=='/login' && user===null) {
		res.redirect('/login')
	}
	next()
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {
  if (user!==null) (next())
  res.status(403).send('Access Denied');
});

router.get('/hidden', function(req, res, next) {
  res.send("You found me! Drat!");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  user = req.body.username
  res.send("Logged in as: "+user);
});

module.exports = router;
