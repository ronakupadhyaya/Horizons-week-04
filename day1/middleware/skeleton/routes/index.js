var express = require('express');
var router = express.Router();

// Store login information here.
//intercept the hidden route and check if theyre logged in
//then proceed to next, go to login page, then redirect them to after they login
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

// router.use(myLogger);

router.use(myLogger, function(req,res,next){
  console.log('Hello world');
  // res.send("hello world"); (hello world text will be on screen)
  next();
});

router.use('/hidden', function(req,res,next){
  if(user) next();
  else{ //this is a req.query
    res.redirect('/login?redirect=hidden');
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // next();
});


router.get('/hidden', function(req, res, next) {
  res.send("<h1>I hate u " + user+ "!</h1>");
  // next();
});

router.get('/login', function(req, res, next) {
  res.render('login');
  // next();
});

router.post('/login', function(req, res, next) {
  // this is when we set the user variable
  // res.send("Not implemented yet");
  user = req.body.username;
  if(req.query.redirect){//req.query.redirect means there is a question mark in the url, just a string that is part of the url
    res.redirect('/'+ req.query.redirect);
  } else{
    res.redirect('/');
  }
  // next();
});

module.exports = router;

//NOTES from lecture
// use -> npm install, then npm install -g nodemon
//get only returns get
// router.get('/', function(req,res,next){
//   console.log('MATCHED ROOT ROUTE');
//   res.render('index',{title:'Express'});
//   // res.render('error', {message: "I win",})
//   // var err = new Error('Not Found');
//   // err.message = "Hi there";
//   res.redirect('/moose123'); //this redirects to a specific page, not like next (which goes to next function)
// });
//
// router.use('/moose123', function(req,res,next){
//   console.log('Time', Date.now());
//   res.send(err.message);
// })
//JS is stateful: it remembers whta's in the console
//HTTP is stateLESS: p stands for protocol, has no memory
//this will work for all users (not people individually)
var x = 0;
router.get('/', function(req, res, next) {
  res.render('index', { title: x++ });
  // next();
});
