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
  //apiKey: process.env.GEOCODING_API_KEY || "AIzaSyBqqiPsHSWu-V3TvKkyH6ocBN3L1q-uZeg",
  apiKey: "AIzaSyDTXl23UKN9aqWG0zcYQHGqHDzMnRkUwwo",
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

router.get('/', function(req, res) {
  res.redirect('/users');
})


router.get('/users/:userId', function(req, res) {
  // req.user.getFollows(function(err, follows) {
    User.findOne({_id: req.params.userId}, function(err, us) {
      if (err) console.log("ERROR", err);
      else {
        var u = us;
        u.getFollows(function(err, follows) {
          var allFollowers = follows.allFollowers;
          var allFollowings = follows.allFollowings;
          req.user.isFollowing(req.params.userId, function(bool) {
            var followBool = bool;
            u.getReviews(req.params.userId, function(err, reviews) {
              res.render('singleProfile.hbs', {
                user: u,
                followers: allFollowers,
                followings: allFollowings,
                followBool: followBool,
                allReviews: reviews.allReviews
              })
            })
          })
        });
      }
    })
})

router.get('/users', function(req, res) {
  User.find(function(err, users) {
    if (err) console.log('ERROR', err);
    else {
      res.render('profiles.hbs', {
        users: users
      })
    }
  })
})

router.post('/follow/:idToFollow', function(req, res) {
  User.findOne({_id: req.user._id}, function(err, me) {
    if (err) console.log(err);
    else {
      me.follow(req.params.idToFollow, function(err, user) {
        if (err) console.log(err);
        else res.redirect('/users/' + req.user._id)
      });
    }
  })
})

router.post('/unfollow/:idToUnfollow', function(req, res) {
  User.findOne({_id: req.user._id}, function(err, me) {
    if (err) console.log(err);
    else {
      me.unfollow(req.params.idToUnfollow, function(err, user) {
        if (err) console.log(err);
        else res.redirect('/users/' + req.user._id)
      });
    }
  })
})


router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant.hbs');
});

router.get('/restaurants/:restaurantId', function(req, res, next) {
  Restaurant.findOne({_id: req.params.restaurantId}, function(err, restaurant) {
    if (err) console.log(err);
    else {
      restaurant.getReviews(req.params.restaurantId, function(err, reviews) {
        res.render('singleRestaurant.hbs', {
          restaurant:restaurant,
          price: "$".repeat(restaurant.price),
          allReviews: reviews.allReviews
        });
      })
    }
  })
});


router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    if (err) console.log(err);
    else {
      res.render('restaurants.hbs', {
        restaurants: restaurants
      });
    }
  })
})


router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    if (err) console.log(err);
    else {
      var newRes = new Restaurant({
        name: req.body.name,
        category: req.body.category,
        latitude: data[0].latitude,
        longitude: data[0].longitude,
        price: req.body.price,
        openTime: req.body.open,
        closeTime: req.body.close
      });
      newRes.save(function(err) {
        if (err) console.log("ERROR", err);
        else {
          console.log("SAVED", newRes);
          res.redirect('/restaurants');
        }
      })
    }
  });
  // Geocoding - uncomment these lines when the README prompts you to!

});

router.get('/restaurants/:restaurantId/review', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) console.log("ERROR", err);
    else {
      res.render('newReview.hbs', {
        restaurant: restaurant
      })
    }
  })
});

router.post('/restaurants/:restaurantId/review', function(req, res) {
  var newReview = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantId: req.params.restaurantId,
    userId: req.user._id
  });
  newReview.save(function(err, review) {
    if (err) console.log("ERROR", err);
    else {
      console.log("SAVED", review);
      res.redirect('/restaurants/' + req.params.restaurantId);
    }
  })
});

module.exports = router;
