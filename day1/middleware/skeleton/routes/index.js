var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;
var page = "";

// Your middleware goes here.
// CAREFUL! Order matters!


router.get('/', function(req, res, next) {
  if(user){
  	res.render('index', { title: 'Express' });
  }
  else {
  	res.redirect('/login');
  	page = '/';
  }
});

router.get('/hidden', function(req, res, next) {
  res.send("ACCESS DENIED");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  if (req.body.username) {
  	user = req.body.username;
  	res.redirect(page);
  }
  res.send("Not implemented yet");
});

router.use(function(req, res, next){
	console.log("INTERCEPTED REQUEST");
})

module.exports = router;
