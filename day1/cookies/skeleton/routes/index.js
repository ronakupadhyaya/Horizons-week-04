var express = require('express');
var router = express.Router();

var cookieStore = {};

var generateId = function() {
  var chunk = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return chunk() + chunk() + '-' + chunk() + '-' + chunk() + '-' +
    chunk() + '-' + chunk() + chunk() + chunk();
};

//res.cookie sets, req.cookies gets

router.use(function(req, res, next) {
  // Your middleware goes here: check for a cookie, and create one if there
  // isn't one. Use generateId() to generate a unique cookie value.
  if(req.cookies.sugarCookie){
    //this means that we have an id on them
    if(cookieStore[req.cookies.sugarCookie]) {
      req.session = {user: cookieStore[req.cookies.sugarCookie]};
    }
    next();
  } else {
    //this means they are a new visitor
    var id = generateId();
    res.cookie("sugarCookie", id);
    cookieStore[id] = null;
    next();
  }
});


router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'text/html');
  if (req.session && req.session.user) {
    res.write("<h1>Welcome back, " + req.session.user + "!</h1><p><a href='/logout'>Click here</a> to logout.</p>");
  }
  else {
    res.write("<h1>I don't know who you are!</h1><p><a href='/login'>Click here</a> to login.</p>");
  }
  res.end();
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  
  cookieStore[req.cookies.sugarCookie] = req.body.username;
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  cookieStore[req.cookies.sugarCookie] = null;
  res.redirect('/');
});

module.exports = router;
