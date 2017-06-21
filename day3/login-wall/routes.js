var express = require('express');
var router = express.Router();

router.use(function(req,res,next){
  if(req.user){
    console.log("req.user: ",req.user);
    next();}
  else{
    console.log("you are NOT logged in!");
    res.redirect('/login')};
})

router.get('/', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/private', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/secret', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

module.exports = router;
