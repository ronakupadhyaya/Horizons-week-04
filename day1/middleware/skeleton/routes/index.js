var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!


router.use(function(req, res, next){
  // think about authentication
  // log in / password and redireect
  // or intercept and next()
  // next() will call the get/post/delete of the same route
  // or if it is use of all routes
  // for a given request, you should have one response
  // i.e. try to avoid using next();
  console.log("INTERCEPTED REQUEST");
  next();
});

// var handleHidden = function(req, res, next){
//   anything
      // so long as you say next();
      // it will not continue
      // assuming you are using render, redirect, etc.
// }
// can use to pass as many times as you want into get/post/etc 

// order matters !

router.get('/', function(req, res, next) {
  if(user){
  	res.render('index', { title: 'Express' });
  }
  else {
  	res.redirect('/login?redirect=hidden');
  }
});

router.get('/hidden', function(req, res, next) {
  if (user){
    res.send("<h1>ACCESS DENIED</h1>");
  };
  else{
    res.redirect('/login?redirect=hidden');
  }

});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  if (req.query.redirect){
    res.redirect('/'+ req.query.redirect);
    user = req.body.username;
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
