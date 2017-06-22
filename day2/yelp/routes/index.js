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
  apiKey: process.env.GEOCODING_API_KEY,
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

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
  });

});

router.get('/users/:id', function(req, res) {
  User.findById(req.params.id, function(error, user) {
    user.getFollows(req.params.id, function(isFollowing, allFollowers) {
      user.getReviews(req.params.id, function(err, reviews){
        res.render('singleProfile', {
          user: user,
          following: isFollowing,
          followers: allFollowers,
          reviews: reviews
        })
      })
    })
  })
})

router.get('/users', function(req,res) {
  User.find().exec(function(error, users) {
    res.render('profiles', {
      users: users
    })
  })
})

router.post('/follow/:userId2', function(req,res) {
  req.user.follow(req.params.userId2, function(){
    res.redirect('/users/'+req.params.userId2)
    })
})

router.post('/unfollow/:userId2', function(req,res) {
    req.user.unfollow(req.params.userId2, function(){
      res.redirect('/users/'+req.params.userId2)
    })
})

router.get('/restaurants', function(req,res) {
  Restaurant.find().exec(function(error, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurants/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(error, restaurant) {
    restaurant.getReviews(req.params.id, function(error, reviews) {
      console.log(restaurant)
    res.render('singleRestaurant', {
      restaurant: restaurant,
      reviews: reviews,
      averageRating: restaurant.averageRating
    })
    })
  })
})

router.get('/newrestaurant', function(req,res) {
  res.render('newRestaurant')
})

router.post('/newrestaurant', function(req, res) {
  var newRestaurant = new Restaurant ({
    name: req.body.name,
    category: req.body.category,
    price: parseInt(req.body.price),
    address: req.body.address,
    opentime: parseInt(req.body.opentime),
    closetime: parseInt(req.body.closetime),
    totalScore: 0,
    reviewCount: 0
  })
  newRestaurant.save()
  res.redirect('/restaurants')
})

router.get('/newreview/:id', function(req, res) {
  res.render('newReview', {
    id: req.params.id
  })
})

router.post('/newreview/:id', function(req,res) {
  var newReview = new Review ({
    content: req.body.content,
    stars: req.body.rating,
    restaurantId: req.params.id,
    userId: req.user._id
  })
  newReview.save()
  Restaurant.findById(req.params.id, function(err, restaurant){
    restaurant.totalScore = restaurant.totalScore + newReview.stars
    restaurant.reviewCount++
    restaurant.save()
  })
  res.redirect('/restaurants/'+req.params.id)
})

module.exports = router;
