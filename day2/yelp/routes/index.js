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
  apiKey: "AIzaSyBdA5xhVP1GMIxy96yYEp68QpEein8TCbU",
  httpAdapter: "https",
  formatter: null
});

// forphoto: AIzaSyAUvqeRfpCeRKJkaqiSv_bqky2jyJVmAbg

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//HOMEPAGE
router.get('/', function(req,res){
    User.find(function(err, users) {
    res.render('homepage')
  })
})

//ALLPROFILE
router.get('/users', function(req,res){
    User.find(function(err, users) {
    res.render('profiles', {
      users: users
    })
  })
})

//SINGLEPROFILE
router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;
  User.findById(userId, function(err, user){
    if(err || !user) {
      res.status(404).send("no user") }
    else {
      user.getFollows(function(err, result) {
        var allFollowing = result.allFollowing
        var allFollowers = result.allFollowers
        res.render('singleProfile', {
          user: user,
          following: allFollowing,
          followers: allFollowers
        })
      })
    }
  })
})

//FOLLOWBUTTON
router.post('/follow/:userId', function(req,res) {
  User.findById(req.user._id, function(err, user){
    user.follow(req.params.userId, function(err, result) {
      res.redirect('/')
    })
  })
})

//UNFOLLOW
router.post('/unfollow/:userId', function(req,res) {
  userId = req.user._id
  User.findById(userId, function(err, user){
    user.unfollow(req.params.userId, function(err, result){
      res.redirect(`/users/${userId}`)
    })
  })
})

//NEW RESTAURANT
router.get('/restaurant/new', function(req,res){
    res.render('newRestaurant')
  })
router.post('/restaurant/new', function(req, res) {

  geocoder.geocode(req.body.address, function(err, data) {
    console.log(data);

    var restaurant = new models.Restaurant({
      name: req.body.name,
      category: req.body.category,
      longitude: data[0].longitude,
      latitude: data[0].latitude,
      price: req.body.price,
      opentime: req.body.openTime,
      closingtime: req.body.closingTime
    });

    restaurant.save(function(err, rest) {
      if (err) {
        console.log(err);
        res.status(500)
        return;
      }
      console.log(rest);
      res.redirect('/restaurants');
    });
  })
})
  //ALLRESTAURANTS
  router.get('/restaurants', function(req,res){
      Restaurant.find(function(err, restaurants) {
      res.render('restaurants', {
        restaurants: restaurants
      })
    })
  })

  router.get('/restaurant/:restaurantId', function(req,res) {
    var restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId, function(err, restaurant){
      if(err || !restaurant) {
        res.status(404).send("no user") }
      else {

        restaurant.getReviews(restaurantId, function(err, reviews) {
          res.render('singleRestaurant', {
            restaurant: restaurant,
            reviews: reviews
          })
        })
      }
    })
  })

//WRITE A Review
router.get('/review/new/:restaurantId', function(req,res){
    res.render('newReview')
  })

//POSTReview
router.post('/review/new/:restaurantId', function(req, res) {
var restaurantId = req.params.restaurantId;
  var review = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantId: restaurantId,
    userId: req.user._id
  });

  review.save(function(err, review) {
    if (err) {
      console.log(err);
      res.status(500)
      return;
    }
    res.redirect('/restaurants');
    });
  })

module.exports = router;
