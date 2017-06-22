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

router.get('/user/:userid', function(req,res){
  var userid = req.params.userid;
  console.log(userid)
  User.findById(userid, function(err, userObj){
    if (err){
      console.log("User does not exist - get error")
    } else{
      console.log(userObj)
      userObj.getFollows(function(followers, followings) {
        res.render('singleProfile', {
          user: userObj,
          allFollowers: followers,
          allFollowings: followings
        })
      })
    }
  })

})

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

module.exports = router;
