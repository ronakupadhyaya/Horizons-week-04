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

router.get('/users/:userId', function(req, res) {
  var userId = req.params.userId;

  User.findById(userId, function(err, user) {
    if (err || !user) {
      res.status(404).send("No user");
    } else {
      user.getFollows(function(err, result) {
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        res.render('singleProfile', {user: user, currentUserId: userId, following: allFollowing, followers: allFollowers})
      })
    }
  })
})

router.get('/profiles', function(req, res) {
  User.find(function(err, user) {
    if (err || !user) {
      res.status(404).send("No users exist on the platform");
    }
    else {
      res.render('profiles', {
        user: user
      })
    }
  })
})

router.get('/follow/:userId', function(req, res) {
  req.user.follow(req.params.userId, function() {
    res.redirect('/')
  })
})

router.get('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function() {
    res.redirect('/')
  })
})

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant', {})
})

router.post('/restaurants/new', function(req, res, next) {

  var restaurant = new Restaurant({
    name: req.body.restName,
    category: req.body.restCategory,
    latitude: 1,
    longitude: 2,
    price: req.body.restPrice,
    openTime: req.body.restOpenTime,
    closingTime: req.body.restClosingTime
  })

  restaurant.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/restaurants/new');
        return;
      }
      console.log(user);
      res.redirect('/restaurants');
  });
  

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurant) {
    res.render('restaurants', {restaurant: restaurant})
  })
})

module.exports = router;