var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;
var url = null;

// Your middleware goes here.
// CAREFUL! Order matters!
router.use(function(req, res, next) {
  console.log("Hello world!");
  next();
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/hidden', function(req, res, next) {
  if (user) next();
  else {
    res.redirect('/login?redirect=' + req.originalUrl);
  }
});

router.get('/hidden', function(req, res, next) {
  res.send("You found me!");
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  user = req.body.username;
  if(req.query.redirect) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect('/');
  }
});

router.post('/hidden', function(req, res, next) {
  res.send("You found me!")
	
})

module.exports = router;
