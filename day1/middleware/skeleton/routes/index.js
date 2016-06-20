var express = require('express');
var router = express.Router();

// Store login information here.
var user = null;

// Your middleware goes here.
// CAREFUL! Order matters!
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

router.use(myLogger);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // next();
});

router.get('/hidden', function(req, res, next) {
  res.send("Access Denied");
  // next();
});

router.get('/login', function(req, res, next) {
  res.render('login');
  // next();
});

router.post('/login', function(req, res, next) {
  // Your code here
  res.send("Not implemented yet");
  // next();
});

module.exports = router;

//NOTES from lecture
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
