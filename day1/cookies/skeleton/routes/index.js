//information stored in the browzer as key value pair
//res.cookie -> sets
//req.cookies.(keyname) -> gets

var express = require('express');
var router = express.Router();

var cookieStore = {};

var generateId = function() {                                 //returns an id
  var chunk = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return chunk() + chunk() + '-' + chunk() + '-' + chunk() + '-' +
    chunk() + '-' + chunk() + chunk() + chunk();
};

router.use(function(req, res, next) {
if (req.cookies.mySession){     //valid session
  //this means that we have an id on them
  if (cookieStore[req.cookis.mySession]){
    //this means they are logged in 
    req.session = {user = cookieStore[req.cookis.mySession]   //setting session property user 
  })
  next();
}else{
  //This means they are a new visitor
  var id = generate Id()
  res.cookie("myySession", id);   //way to id each user to the site     if they don't have a cookie then this will generate an id
    cookieStore[id] = null      //if they are not logge in they are null
    next()                    //null is if they are logged out
}
  // Your middleware goes here: check for a cookie, and create one if there
  // isn't one. Use generateId() to generate a unique cookie value.
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
  cookieStore[req.cookies.mySession] = null   //delete the name and change it to null
  res.redirect('/');
});

module.exports = router;
