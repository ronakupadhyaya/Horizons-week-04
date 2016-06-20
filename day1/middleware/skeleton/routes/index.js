var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!


router.get('/', function(req, res, next) {
	console.log('yo');
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {
	if (user) {
    next();
  }
  else {
    res.redirect('/login?redirect=hidden');
  }
  res.send("You found me! Drat!");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  //var username = $('Log In').val();
  // or check if text box is empty
  user = req.body.username;
  if (req.query.redirect) {
  	res.redirect('/' + req.query.redirect)
  }

  res.send("Not implemented yet");
});

module.exports = router;
