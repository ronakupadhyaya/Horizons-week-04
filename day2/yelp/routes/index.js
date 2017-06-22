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

// GET /
router.get('/', function(req, res) {
  User.findById(req.user._id, function(err,user){
    user.getFollows(user.id,function(followers, followings) {
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: followings
      })
    })
  })
})

router.get('/users/:userId', function(req, res) {
  User.findById(req.params.userId, function(err,user){
    user.getFollows(user.id, function(followers, followings) {
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: followings
      })
    })
  })
})

router.get('/profiles', function(req, res) {
  console.log(req)
  User.find().exec(function(err, users) {
    res.render('profiles', {
      //users is a array
      users: users
    })
  })
})

router.post('/follow/:userId', function(req, res) {
  // var uid1 = req.params.userId
  console.log(User);
  req.user.follow(req.params.userId, function(err) {
    if (err) {
      console.log('some erro bans follow');
    } else {
      res.redirect('/')
    }
  })
})

router.post('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function(err) {
    if (err) {
      console.log('some erro bans follow');
    } else {
      res.redirect('/')
    }
  })
})
//restaurant
router.get('/restaurant/new', function(req, res, next) {
  res.render('newRestaurant');
});

router.post('/restaurant/new', function(req, res) {
  var restaurant = new Restaurant({
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
    openHoursEST: {
      openTime: parseInt(req.body.openTime),
      closingTime: parseInt(req.body.closingTime)
    }
  });
  restaurant.save(function(err) {
    if (err) return next(err);
    res.redirect('/restaurants');
  });
})

router.get('/singleRestaurant/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) {console.log('error happens when finding restaurant')}
    else {
      restaurant.getReviews(req.params.restaurantId, function(err, reviews) {
        res.render('singleRestaurant', {
          Restaurant: restaurant,
          reviews: reviews
        })
      })
    }
  })
})

router.get('/restaurants', function(req, res) {

})
// router.post


router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
