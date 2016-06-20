var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use(function(req,res,next){
	console.log('yes');
	next();
})

router.use('/hidden', function(req, res, next){
	if(user){
		next();
	} else {
		res.redirect("/login?redirect=hidden");
	}
})
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {
  res.send("Access Denied");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  user = req.body.username;
  res.send("Not implemented yet");

	if(req.query.redirect) {
		res.redirect('/' + req.query.redirect);
	} else {
		res.redirect('/');
	}
});

module.exports = router;
