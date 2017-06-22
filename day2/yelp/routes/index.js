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

router.get('/user/:userid', function(req, res){
  var userID = req.params.userid;
  console.log("is printing here " + userID)
  //console.log("testing, 1, 2, 3")
  User.findById(userID, function(err, userObj){
    console.log(userObj)
    if(err){
      console.log(err)
    }else{
      // console.log("is printing on line 26" + userObj)
      userObj.getFollows(function(followers, following){
        userObj.isFollowing(function(trueOrFalse){
          var isFollowing = null;
          if(trueOrFalse){
            isFollowing = true
          }else{
            isFollowing = false
          }

          res.render('singleProfile', {
            user: userObj,
            isFollowing: isFollowing,
            allFollowing: following,
            allFollowers: followers
          })
        })
      })
    }
  })
})

router.get('/follow/:userid', function(res, req){
  var userID = req.params.userid
  User.findById(userID, function(err, userObj){
    console.log(userObj)
    if(err){
      console.log(err)
    }else{
      userObj.follow()
    }
})
router.get('/follow/:userid', function(res, req){
  var userID = req.params.userid
  User.findById(userID, function(err, userObj){
    console.log(userObj)
    if(err){
      console.log(err)
    }else{
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
