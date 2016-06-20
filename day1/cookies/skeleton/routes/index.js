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
  // if (!req.cookie) {
  //   res.cookie(cookieName, cookieValue);
  // };
  if (req.cookies.mySession) {
    //could be anything, req.cookies.anything
    if (cookieStore[req.cokies.mysession]) {
      //if null, not actualy logged in - they've jsut gotten there
      req.session = {user: cookieStore[req.cokies.mysession]}
    }
    next();
  } else {
    // create one if there isn't one.
    var id = generateId();
    res.cookie("mySession", id);
    //this is a way of identifying EACH user by cookie. 
    cookieStore[id] = null
    //once we log them in, we set them equal to cookie store id
    //cookies are not in the url, they are in the header of http
    // after we set the cookie... 
    next();
  }
  // var id = generateId();
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
  // if (!req.session.user) {
  //   res.write("You need to log in" + "<a href = localhost:3000/login>Login")
  // } else {
  //   res.write("Welcome back " + req.session.user)
  // }

  
  // res.redirect('/');
  cookieStore[req.cookies.mySession] = req.body.username;
  res.redirect('/')''
});

router.get('/logout', function(req, res, next) {
  // Your code here. Delete the user data from the session, but don't delete the
  // cookie or the session itself.
  cookieStore[req.cookies.mySession] = null;
  res.redirect('/');
});

module.exports = router;
