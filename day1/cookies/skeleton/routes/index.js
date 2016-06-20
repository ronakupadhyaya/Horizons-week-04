var express = require('express');
var router = express.Router();

var cookieStore = {};
//example of cookieStore: {"324234324" : "ethan",
//                         "9809809809": "will",
//                         "o8809890809": null}
//null is set by default, will be updated with username once they log in 

//storing a cookie on everyone to see who they are
///stroring ids on everyone (logged in AND out).. keep tack of all ids
// null: not logged in, if username means person is logged in

//can have multiple visitors with one user.. multiple cookie ids


//below: generats a unique id
var generateId = function() {
  var chunk = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return chunk() + chunk() + '-' + chunk() + '-' + chunk() + '-' +
    chunk() + '-' + chunk() + chunk() + chunk();
};

//res.cookie= store cookie, req.cookie= get/retrieve cookie

router.use(function(req, res, next) {
  // Your middleware goes here: check for a cookie, and create one if there
  // isn't one. Use generateId() to generate a unique cookie value.
  //check for cookie and if not create one
  if(req.cookies.mySession){
    if(cookieStore[req.cookies.mySession]){
      req.session = {user: cookieStore[req.cookies.mySession]}
      //setting session property to username
      //^^^ this mans they are logged in 
    }
    next();
  }
  else{
    var id=generateId();
    //this means they are a new visitor
    res.cookie("mySession", id);
    //this is a way of identifying each user by cookie
    cookieStore[id]=null;
    next();
  }
});

//middleware cookie parser: how to ger req.cookie

//only if LOGGED IN: storing name of user along with id, can welcome them
//back based on their name
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
  cookieStore[req.cookies.mySession]=req.body.username;
//   if(req.cookies.sessionCookie){
    res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  // Your code here. Delete the user data from the session, but don't delete the
  // cookie or the session itself.
  cookieStore[req.cookies.mySession]=null;
  
  res.redirect('/');
});

module.exports = router;

//cookies: something eaquals something and something else equals something else
//cookies not in url, stored in http headers

//keeping track of being loffed in via cookieStore

//can look up cookie id because stored someplace else (like mongodb)