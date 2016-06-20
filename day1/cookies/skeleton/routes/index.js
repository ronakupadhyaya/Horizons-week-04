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

router.use(function(req, res, next) {
  // Your middleware goes here: check for a cookie, and create one if there
  // isn't one. Use generateId() to generate a unique cookie value.
  // says if they dont' have a cookie named mySession, then create one
  if (req.cookies.mySession) {
    //this means we have an id on them
    if (cookieStore[req.cookies.mySession]) {
      // this means they are logged in
      req.session = {user: cookieStore[req.cookies.mySession]};
    }
    next();
  }
  else {
    //this means they are a new visitor
    var id = generateId();
    res.cookie("mySession", id);
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
  // Your code here. Set the user inside the session!
  cookieStore[req.cookies.mySession] = req.body.username;
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  // Your code here. Delete the user data from the session, but don't delete the
  // cookie or the session itself.
   cookieStore[req.cookies.mySession] = null;
  res.redirect('/');
});

module.exports = router;
