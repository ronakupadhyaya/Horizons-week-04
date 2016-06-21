var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

router.use(function(req, res, next) {
  console.log('everytime');
  next();
});

router.use('/hidden', function(req, res, next) {
  if (user) {
    next();
  } else {
    console.log(req.originalUrl);
    res.redirect('/login?redirect=' + req.originalUrl);
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
  user = req.body.username;
  if (req.query.redirect) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect('/');
  }
});

module.exports = router;
