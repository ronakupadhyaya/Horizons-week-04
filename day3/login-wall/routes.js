var express = require('express');
var router = express.Router();

//specifying just slash and specifying nothing are the same
//order of middleware is important for security
router.use('/',function(req, res, next){
  if(req.user){
    next()
  } else {
    res.redirect('/login')
  }
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
