var express = require('express');
var router = express.Router();


/* I ADDED THIS PART */
router.use(function(req,res, next){
  if(!req.user){            //if nobody is logged in
    res.redirect('/login')  //redirect to the login page
  }else{
    next()                  //need next or a redirect so it doesnt get hung up
  }
})
/* +++++++++++++++++ */



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
