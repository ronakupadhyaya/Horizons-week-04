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
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users', function(req, res) {
  User.find(function(err, arr) {
    if (err) {
      console.log(err);
    } else {
      res.render('profiles', {
        users: arr
      });
    }
  });
})

router.get('/users/:id', function(req, res) {
  console.log(req.user);
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/users');
    } else {
      req.user.isFollowing(user._id, function(isFollowBool) {
        user.getFollows(function(followingUsers, followerUsers) {
          console.log('isFollow -', isFollowBool);
          res.render('singleProfile', {
            user: user,
            followings: followingUsers,
            followers: followerUsers,
            isFollowBool: isFollowBool
          });
        });
      });
    }
  });
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
