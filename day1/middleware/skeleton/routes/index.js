var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.use(function(req, res, next) {
  res.send('hello world');
  // next();
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hidden', function(req, res, next) {
  res.send("You found me! Drat!");
});

router.get('/login', function(req, res, next) {
  res.render('login',{msg:""});
});

router.post('/login', function(req, res, next) {
  // Your code here
  var username = req.body.username;
  if (username.length) {
    res.redirect('/hidden');
    }
    res.render('index',{title:"Access Denied"});

});

module.exports = router;

