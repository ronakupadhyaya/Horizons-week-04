var express = require('express');
var router = express.Router();

function isLoggedIn(req,res,next) {
  if (req.user){
    next();
  } else {
    res.redirect('/login')
  }
}

/*
or it can be
router.use(function(req,res,next){
  if (req.user) {
  ...
}
})
this equals to:
router.use('/',function(...))
this middleware has to be above everything else
*/

router.get('/', isLoggedIn,function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/private', isLoggedIn,function(req, res) {
  res.render('index', {
    user: req.user
  });
});

router.get('/secret', isLoggedIn,function(req, res) {
  res.render('index', {
    user: req.user
  });
});

module.exports = router;
