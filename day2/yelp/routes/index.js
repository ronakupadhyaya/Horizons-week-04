var express = require('express');
var router = express.Router();
var models = require('../models/models');
var axios = require('axios');
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

// router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
// });

router.get('/users/:userid', function(req, res) {
  var id = req.params.userid
  req.user.getFollows(id, function(followers, followings) {
    User.findById(id, function(err, foundUser) {
      if (err) {
        res.status(500).send('Database Error: singleProfile');
      } else {
        foundUser.getReviews(function(user) {
          res.render('singleProfile', {
            displayName: foundUser.displayName,
            username: foundUser.email,
            address: foundUser.location,
            reviews: foundUser.reviews,
            allFollowers: followers,
            allFollowings: followings,
            reviews: user
          });
        });
      }
    });
  });
});

//used to be /users
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(500).send('Database Error: router.get(/users), find');
    } else {
      res.render('profiles', {users: users});
    }
  });
});

router.get('/newRestaurant', function(req, res) {
  res.render('newRestaurant');
});

router.post('/newRestaurant', function(req, res) {
  var google_api_key = process.env.GOOGLE_API_KEY;
  var latitude;
  var longitude;
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.address}&key=${google_api_key}`)
    .then(function(resp) {
      latitude = resp.data.results[0].geometry.location.lat;
      longitude = resp.data.results[0].geometry.location.lng;
      var newRestaurant = new Restaurant({
        name: req.body.name,
        category: req.body.category,
        latitude: latitude,
        longitude: longitude,
        price: req.body.price,
        openTime: req.body.openTime,
        closingTime: req.body.closingTime,
        totalScore: 0,
        reviewCount: 0
      });
      newRestaurant.save(function(err) {
        if (err) {
          res.status(500).send('Database Error: saving newRestaurant');
        } else {
          res.redirect('/restaurants');
        }
      })
    })
    .catch(function(err) {
      console.log('Error: ', err);
    })
});

router.get('/restaurants', function(req, res) {
  Restaurant.find({}, function(err, foundRestaurants) {
    if (err) {
      res.status(500).send({error: err, errorMsg: "router.get /restaurants"});
    } else {
      res.render('restaurants', {restaurants: foundRestaurants});
    }
  })
});

router.get('/restaurants/:restaurantid', function(req, res) {
  var id = req.params.restaurantid;
  Restaurant.findById(id, function(err, foundRestaurant) {
    if (err) {
      res.status(500).send({error: err, errorMsg: "router.get restaurants/:restaurantid"});
    } else {
      foundRestaurant.getReviews(id, function(rest) {
        res.render('singleRestaurant', {restaurant: foundRestaurant, reviews: rest, id: id});
      });
    }
  });
});

router.get('/restaurants/:restaurantid/review', function(req, res) {
  Restaurant.findById(req.params.restaurantid, function(err, foundRestaurant) {
    if (err) {
      res.status(500).send({error: err, errorMsg: "router.get restaurantsById/Review"});
    } else {
      res.render('newReview', {name: foundRestaurant.name});
    }
  });
});

router.post('/restaurants/:restaurantid/review', function(req, res) {
  var id = req.params.restaurantid;
  var newReview = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantId: id,
    userId: req.user._id
  });
  newReview.save(function(err) {
    if (err) {
      res.status(500).send({error: err, errorMsg: "router.post restaurants/:restaurantId/review"});
    } else {
      res.redirect('/restaurants/' + id);
    }
  })
});

//API Requests
router.post('/api/toggleFollow/:userid', function(req, res) {
  req.user.toggleFollow(req.params.userid, function() {res.json({success: true})});
});

module.exports = router;