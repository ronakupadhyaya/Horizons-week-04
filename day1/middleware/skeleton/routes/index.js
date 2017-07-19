var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  user = req.body.username;
  res.redirect("/");
  // res.send("Not implemented yet");
});


router.use(function(req, res, next) {
  console.log("Hi there!!! XD");
  if (!user) {
    res.redirect("/login");
  } else {
    return next();
  }
});


router.use("/hidden", function(req, res, next) {
  res.send("You found me, " + user +"! Drat!");
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: user});
});


module.exports = router;
