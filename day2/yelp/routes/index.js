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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDzGPryvyNxODImplE-PfCtgWo_nb48l70",
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

router.get('/newreview', function(req, res) {
  res.render('newReview.hbs', {
    name: req.query.name
  });
});

router.post('/newreview', function(req, res) {
  //make a new review here
  console.log("Restaurant name: " + req.body.name);
  Restaurant.findOne({
    name: req.body.name
  }, function(err, restaurant) {
    if (err) {
      console.log(err);
    } else {
      console.log("RESTAURANT ID: " + restaurant._id);
      new Review({
        content: req.body.comment,
        stars: parseInt(req.body.selectpicker),
        restaurantId: restaurant._id,
        userId: req.user._id
      }).save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("SAVED REVIEW SUCCESSFULLY");
          res.redirect('/allRestaurants');
        }
      });
    }
  });
});

// all users
router.get('/allUsers', function(req, res) {
  User.count({}, function(err, count){
    User.find({}, function(err, allUsers) {
      res.render('profiles.hbs', {
        numUsers: count,
        users: allUsers,
        loggedInUser: req.user.displayName
      });
    });
  });
});

// Single profile page
router.get('/users', function(req, res) {
  var id = req.query.id;
  User.findOne({_id: id}, function(err, otherUser) {
    console.log("Other user id: " + otherUser._id);
    console.log("Logged in id: " + req.user._id);

    if (!err && otherUser !== null) {
      otherUser.getFollows(function(allFollowers, allFollowing) {
        otherUser.getReviews(function(err, reviews) {
          if (err) {
            console.log(err);
          } else if (reviews) {
            req.user.isFollowing(id, function(bool) {
              console.log("MIS RESENAS: " + reviews);
              res.render('singleProfile.hbs', {
                followings: allFollowing,
                followers: allFollowers,
                user: otherUser,
                beingFollowed: bool,
                notLoggedInUser: !req.user._id.equals(otherUser._id),
                reviews: reviews
              });
            });
          }
        });
      });
    }
  });
});

// Follow a user
router.post('/follow', function(req, res) {
  var toBeFollowedId = req.query.toBeFollowedId;
  req.user.follow(toBeFollowedId, function(err, success) {
    console.log("err", err);
    console.log("success", success);
    if (err) {
      console.log(err);
    } else if (success) {
      console.log("Success! New follow: " + success);
      res.redirect('/allUsers');
      console.log('should have redirected');
    }
  });
});

// Unfollow a user
router.post('/unfollow', function(req, res) {
 var toBeUnfollowedId = req.query.toBeUnfollowedId;
  req.user.unfollow(toBeUnfollowedId, function(err, success) {
    if (err) {
      console.log(err);
    } else if (success) {
      console.log("Successfully unfollowed!");
      res.redirect('/allUsers');
      console.log('should have redirected');
    }
  });
});

router.get('/allRestaurants', function(req, res) {
  Restaurant.find({}, function(err, restaurants) {
    console.log("Restaurants: " + restaurants);
    res.render('restaurants.hbs', {
      restaurants: restaurants
    });
  });
});

router.get('/restaurant', function(req, res) {
  var id = req.query.id;
  console.log('id: ' + id);
  Restaurant.findOne({_id: id}, function(err, restaurant) {
    var arr = [];
    for (var i = 0; i < restaurant.price; i++) {
      arr.push(i + 1);
    }
    var startTime = "";
    var endTime = "";
    if (restaurant.openTime <= 12) {
      startTime += restaurant.openTime + "am";
    } else {
      startTime += (restaurant.openTime - 12) + "pm";
    }
    if (restaurant.closingTime <= 12) {
      endTime += restaurant.closingTime + "am";
    } else {
      endTime += (restaurant.closingTime - 12) + "pm";
    }
    restaurant.getReviews(function(err, reviews) {
      if (err) {
        console.log(err);
      } else if (reviews) {
        res.render('singleRestaurant.hbs', {
          restaurant: restaurant,
          count: arr,
          open: startTime,
          end: endTime,
          has1: restaurant.price === 1,
          has2: restaurant.price === 2,
          has3: restaurant.price === 3,
          reviews: reviews
        });
      }
    });
  })
});

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant.hbs');
});

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    var name = req.body.name;
    var price = req.body.price;
    var openTime = req.body.openTime;
    var closingTime = req.body.closingTime;
    var longitude = data[0].longitude;
    var latitude = data[0].latitude;
    var category = req.body.selectpicker;
    new Restaurant({
      name: name,
      category: category,
      latitude: latitude,
      longitude: longitude,
      price: price,
      openTime: openTime,
      closingTime: closingTime
    }).save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("SAVED!");
        res.redirect('/allRestaurants');
      }
    });
  });
});

module.exports = router;
