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

router.get('/', function(req, res){
  var followers;
  var following;

  req.user.getFollows(function(following, followers){
    followers = followers;
    following = following;
    res.render('singleProfile', {
      user: req.user,
      following: following,
      followers: followers
    })
  })
})

router.get('/:profileid', function(req, res){
  var id = req.params.profileid
  var myProfile = req.user
  User.findById(id, function(err, profile){
    if(err){
      console.log('didnt find profile object, database error')
    }
    profile.getFollows(function(following, followers){
      myProfile.isFollowing(id, function(bool){
        console.log(bool)
        notBool = !bool
        res.render('singleProfile', {
          user: profile,
          following: following,
          followers: followers,
          isFollowing: bool,
          notIsFollowing: notBool,
        })
      })
    })
  })
})

router.post('/:profileid', function(req, res){
  var id = req.params.profileid
  var myProfile = req.user
  if(req.body.buttonType === 'follow'){
    myProfile.follow(id, function(err, success){
      if(err){
        console.log('error in saving follower', err)
      }
      console.log('success in saving', success)
      res.send(200)
    })
  }else{
    myProfile.unfollow(id, function(err, success){
      if(err){
        console.log('error in removing follower', err)
      }
      console.log('success in removing', success)
      res.send(200)
    })
  }
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
