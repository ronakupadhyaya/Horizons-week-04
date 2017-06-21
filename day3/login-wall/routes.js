var express = require('express');
var router = express.Router();

//redirects everything to login page if an unknown page or if not logged in


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


router.use('/',function(req,res,ext){ //matches everything that starts with the prefix / and will run
  if(req.user){
    next();
  } else{
    res.redirect('/login');
  }
})

module.exports = router;
