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

// THE WALL - any routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});


router.get('/', function(req, res) {
  res.redirect('/restaurants');
});

router.get('/profile', function(req, res) {
  var currentUser = req.user;

  currentUser.getReviews(function(err, reviews) {
    if (err) {
      console.log('Error getting reviews for current user', err);
    }
    else {
      currentUser.getFollows(function(err2, follows) {
        if (err2) {
          console.log('Error getting follows for current user');
        }
        else {
          //left off here
        }
      });
    }
  });


  res.render('singleProfile', {
    user: req.user
  });
});

router.get('/restaurants', function(req, res) {
  Restaurant.find({}, function(err, restaurants) {
    if (err) {
      console.log('Error getting all the restaurants to display', err);
    }
    else {
      console.log(restaurants);
      res.render('restaurants', {
        restaurants: restaurants
      });
    }
  });
});

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
  var newRestaurant = new Restaurant(req.body);
  console.log(newRestaurant);

  newRestaurant.save(function(err) {
    if (err) {
      console.log('Error posting new restaurant to database', err);
    }
    else {
      res.redirect(`/restaurants/` + newRestaurant._id);
    }
  });
});

router.get('/restaurants/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) {
      console.log('Error finding restaurant for single page',err);
    }
    else {
      restaurant.getReviews(req.params.restaurantId, function(err, reviews) {
        if (err) {
          console.log("Error getting reviews when displaying restaurant", err);
        } 
        else {
          res.render('singleRestaurant', {
            reviews: reviews,
            restaurant: restaurant
          });
        }
      });
    }
  });
});

router.get('/restaurants/writereview/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) {
      console.log('Error finding restaurant for single page',err);
    }
    else {
      res.render('newReview', {
        restaurant: restaurant
      });
    }
  });
});

router.post('/restaurants/writereview/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) {
      console.log('Error finding restaurant for writing review',err);
    }
    else {
      var newReview = new Review({
        stars: req.body.stars,
        content: req.body.content,
        restaurant: req.params.restaurantId,
        user: req.user._id
      });
      console.log(newReview);
      newReview.save(function(err) {
        if (err) {
          console.log('Error posting new review to database', err);
        }
        else {
          var newRevCount = restaurant.reviewCount + 1;
          restaurant.update({reviewCount: newRevCount}, function(err) {
            if (err) {
              console.log('Error updating the review count', err);
            }
            else {
              res.redirect('/restaurants/' + req.params.restaurantId);
            }
          });
        }
      });
    }
  });
});

module.exports = router;