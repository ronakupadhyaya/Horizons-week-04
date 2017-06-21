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

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

// THE WALL - anything routes below this are protected!
router.get('/users/:userId', function(req, res) {
  var userId = req.params.userId;
  User.findById(userId, function(err, user) {
    if (err || !user) {
      res.status(404).send("No user")
    }
    else {
      user.getFollows(function (err, result) {
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        res.render('singleProfile', {
          user: user,
          allFollowers: allFollowers,
          allFollowing: allFollowing
        })
      })
    }
  })
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/', function(req, res) {
  User.find(function(err, user) {
    if (err || !user) {
      res.status(500).send("cannot find users")
    }
    else {
      res.render('profiles', {
        user: user
      })
    }
  })
})

router.get('/addNewRestaurant', function(req, res) {
  res.render('newRestaurant')
})

router.post('/addNewRestaurant', function(req, res) {
  var newRestaurant = new models.Restaurant ({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime: req.body.closingTime
  });
  newRestaurant.save(function(err, newR) {
    if (err) {
      console.log(err)
      res.status(500).send('Cannot save new Restaurant')
    }
    else {
      res.redirect('/restaurants')
    }
  })
})
//
router.get('/restaurants/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, restaurant) {
    if (err) {
      res.status(500).send('cannot find restaurant')
    }
    else {
      res.render('singleRestaurant', {
        restaurant: restaurant
      });
    }
  })
})

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurant) {
    if (err) {
      res.status(500).send('cannot find restaurant')
    }
    else {
      res.render('restaurants', {
        restaurant: restaurant
      });
    }
  })
})

router.get('/follow/:userId', function(req, res) {
  req.user.follow(req.params.userId, function(err, result){
    res.redirect('/users/'+req.params.userId)
  })
})

router.get('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function(err, result){
    res.redirect('/users/'+req.params.userId)
  })
})
module.exports = router;
