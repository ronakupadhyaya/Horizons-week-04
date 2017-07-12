var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var exphbs = require('express-handlebars');

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDxEONK-dRzghGkAj-x-7vuMy9PG08JT4k",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res, next) {
  res.redirect('/profiles');
})

router.get('/users/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log('User does not exist');
    } else {
      user.getFollows(function(followingUsers, followerUsers) {
        req.user.isFollowing(req.params.id, function(bool) {
          console.log(bool);
          res.render('singleProfile', {
            user: user,
            followings: followingUsers,
            followers: followerUsers,
            isFollowing: bool
          })
        })
      })
    }
  })
})

router.post('/unfollow/:id', function(req, res, next) {
  var user = req.user;

  user.unfollow(req.params.id, function(err) {
    res.redirect('/profiles')
  })
})

router.post('/follow/:id', function(req, res, next) {
  var user = req.user;

  user.follow(req.params.id, function(err) {
    res.redirect('/profiles')
  })
})

router.get('/profiles', function(req, res, next) {
  var user = req.user;
  User.find({}, function(err, arr) {
    user.getFollows(function(followingUsers, followerUsers) {
      res.render('profiles', {
        users: arr,
        helpers: {
          isSelf: function(id) {
            if (id === req.user.id)
              return true;
            else {
              return false;
            }
          },
          shouldShow: function(id) {
            var tempArr = followingUsers.filter(function(obj) {
              return obj.id === id
            })
            if (tempArr.length === 1)
              return false;
            return true;
          }
        }
      })
    })
  })
})

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    var restaurant = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime
    })
    restaurant.save();

    res.redirect('/restaurants/' + restaurant.id)
  })
})

router.get('/restaurants/:id', function(req, res, next) {
  Restaurant.findById(req.params.id, function(err, restaurant) {
    res.render('singleRestaurant', {
      restaurant: restaurant,
      helpers: {
        isPrice: function(val) {
          if (restaurant.price === val)
            return true;
          return false;
        }
      }
    })
  })
})

module.exports = router;