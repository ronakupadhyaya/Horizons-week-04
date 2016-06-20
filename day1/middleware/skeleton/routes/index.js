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

router.use(myLogger);

//taking to / page and trying to login
router.get('/', function(req, res,next){
  var sess = req.session;
  console.log("Session data"+ JSON.stringify(sess));
  console.log("Cookies:" + JSON.stringify(req.cookies));
  setHeader('Content-Type', 'text/html');
  //check if user's been used before
  if(req.user){
    res.render('index',{title:"Welcome back"+req.user.name + "!"});
  }
  else{
    res.render('index',{title:"Hey you're new! Login!"});
  }
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

// var x = 0;
// router.get('/', function(req, res, next) {
//   res.render('index', { title: x++ });
//   // next();
// });

//COOKIES AND SESSIONS
// router.get('/', function(req, res,next){
//   var sess = req.session;
//   console.log("Session data"+ JSON.stringify(sess));
//     console.log("Cookies:" + JSON.stringify(req.cookies));
//   // res.setHeader('Content-Type', 'text/html');
//   //check if user's been used before
//   if(sess.count){
//     res.render('index',{title:"I've seen you before " + sess.count + " times!"});
//     sess.count++;
//   }
//   else{
//     sess.count=1;
//     res.render('index',{title:"Hey you're new!"});
//   }
//
// });
// module.exports = router;
