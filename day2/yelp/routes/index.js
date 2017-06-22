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

router.get('/', function(req, res) {
  if(req.user) {
    res.render('singleProfile', {
      user: req.user
    })
  }
  else {
    console.log("user not found")
  }
})

router.get('/user/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    user.getFollows(req.params.user_id, function(followers, followings) {
      user.isFollowing(req.user._id, function(bool) {
        console.log(bool)
        console.log('followers are', followers, 'following is', followings)
        res.render('singleProfile', {
          user: user,
          allFollowers: followers,
          allFollowings: followings,
          isFollowing: bool
        })
      })
    })
  })
})

router.get('/profiles', function(req, res) {
  User.find(function(err, users) {
    if(err) {
      console.log(err)
    }
    else{
      var usersToReturn = []
      User.findById(req.user._id, function(err, me){
      me.getFollows(req.user._id, function(followers, following){
        users.forEach(function(user){
          var isFollowing = false;
          following.forEach(function(follow){
            if(follow.to._id === user._id){
              isFollowing = true
            }
          })
          var temp = {
            displayName: user.displayName,
            email: user.email,
            location: user.location,
            isFollowing: isFollowing
          }
          usersToReturn.push(temp)
        })
        console.log(usersToReturn)
        res.render('profiles', {
          user: usersToReturn
        })
      })
    })
    }
  })
})


router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
