var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDXupeurqjJa4WGnrh8U0Vn7Bzp3IYl8G4",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
});

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(error, restaurants) {
    res.render('restaurants', {restaurants: restaurants});
  });
});

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    var newRestaurant = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      open: req.body.open,
      close: req.body.close
    });
    console.log(newRestaurant);
    newRestaurant.save(function(error) {
      res.redirect("/restaurants");
    });
  });

});

router.get('/singleRestaurant/:restId', function(req, res) {
  Restaurant.findById(req.params.restId, function(error, foundRest) {
    foundRest.getReviews(req.params.restId, function(reviews) {
      res.render('singleRestaurant', {restaurant: foundRest, reviews: reviews});
    });
  });
});

router.get('/profiles', function(req, res, next) {
  User.find({_id: {$ne: req.user._id}}, function(error, allUsers) {
    console.log(allUsers);
    res.render('profiles', {users: allUsers, myId: req.user._id});
  })
});

router.get('/singleProfile/:userId', function(req, res, next) {
  var userId = req.params.userId;
  User.findById(userId, function(error, foundUser) {
    var follow = req.user.isFollowing(userId);
    var myProfile = !(userId == req.user._id);
    if(!myProfile) {
      follow = false;
    }
    foundUser.getFollows(function(following, followers) {
      foundUser.getReviews(foundUser._id, function(reviews) {
        res.render("singleProfile", {user: foundUser, following: following,
          followers: followers, myProfile: myProfile, reviews: reviews});
        });
      });
    });
  });

  router.get('/follow/:idToFollow', function(req, res, next) {
    var idToFollow = req.params.idToFollow;
    var currUser = req.user;
    currUser.follow(idToFollow, function() {
      res.redirect(`/singleProfile/${idToFollow}`);
    });
  });

  router.post('/unfollow/:idToUnfollow', function(req, res, next) {
    var idToUnfollow = req.params.idToUnfollow;
    var currUser = req.user;
    currUser.unfollow(idToUnfollow, function() {
      res.redirect(`/singleProfile/${currUser._id}`);
    });
  });

  router.get('/newReview/:restId', function(req, res) {
    Restaurant.findById(req.params.restId, function(error, restaurant) {
      res.render("newReview", {restaurant: restaurant});
    })
  });

  router.post('/newReview/:restId', function(req, res) {
    var restId = req.params.restId;
    var newReview = new Review ({
      content: req.body.content,
      stars: req.body.stars,
      restaurantId: restId,
      userId: req.user._id
    });
    newReview.save(function(error, savedReview) {
      res.redirect(`/singleRestaurant/${restId}`);
    });
  });



  module.exports = router;
