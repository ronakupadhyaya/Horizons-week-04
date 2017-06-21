var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/',function(req,res){
  res.send('Home Page');
})

router.post()

router.get('/user/:userId',function(req,res){
  var thisId = req.params.userId;
  User.findById(thisId, function(err,result){
    if(err || !result){
      res.status(404).send("No User found")
    } else {
      result.getFollows(function(err,follows){
        if(err || !follows){
          res.status(404).send("No follow info found")
        } else {
          res.render('singleProfile',{user:result, following:follows.allFollowing, followers:follows.allFollowers});
        }
      })

    }
  })
})

module.exports = router;
