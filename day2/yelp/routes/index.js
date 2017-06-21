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

router.get('/users', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      nb_users: users.length,
      users: users
    })
  })
})

router.get('/users/:userId', function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (!user) {
      console.log('Cannot find user');
      res.redirect('/login');
    } else {
      user.getFollows(function(err, followers, following) {
        res.render('singleProfile', {
          user: user,
          followers: followers,
          following: following
        })
      })
    }
  })
})

router.post('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function() {
    req.user.getFollows(function(err, followers, following) {
      res.render('singleProfile', {
        user: req.user,
        followers: followers,
        following: following
      })
    })
  })
})

// router.get('/temp', function(req, res) {
//   User.findById("594996b31c016e3fb88cea98", function(err, user1) {
//     User.findById("59499fa1b8b3e82450600270", function(err, user2) {
//       console.log(user1, user2);
//       var newFollow = new Follow({
//         uid1: user1._id,
//         uid2: user2._id
//       })
//       newFollow.save(function(err) {
//         console.log(err)
//         res.send("created follow")
//       })
//     })
//   })
// })

module.exports = router;