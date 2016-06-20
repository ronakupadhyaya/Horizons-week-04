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
  if (req.cookies.sessionCookie) {
    console.log("here's a cookie");
    var session = cookieStore[req.cookies.sessionCookie];
    if (session && session._valid) {
      console.log("Session data: " + JSON.stringify(session));
      req.session = session;
      next();
      return;
    }
  }
  console.log("Cookie not found or session data invalid, setting new cookie");
  var id = generateId();
  res.cookie('sessionCookie', id);
  req.session = cookieStore[id] = {_valid: true};
  next();
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
  req.session.user = req.body.username;
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  // Your code here. Delete the user data from the session, but don't delete the
  // cookie or the session itself.
  
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
