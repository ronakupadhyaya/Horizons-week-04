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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDOa6_XxT1SdAMDZCdksU2DHGrkG_v3Dgs",
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

router.get('/', function(req, res) {
  res.send('Home Page');
});

//get profile page
router.get('/users/:id', function(req, res) {
  //console.log(req.user);
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err || !user) {
      res.status(404).send('No user');
    } else {
      //var isFollowing = req.user.isFollowing(user);
      //console.log("isFollowing: ", isFollowing);
      user.getFollows(function(err, result) {
        var allFollowers = result.allFollowers;
        var allFollowing = result.allFollowing;
        console.log('rendered', {
          user: user,
          following: allFollowing,
          followers: allFollowers
        });

        res.render('singleProfile', {
          user: user,
          following: allFollowing,
          followers: allFollowers
          // isFollowing: isFollowing
        });
      })
    }
  });
});

//get profileS page
router.get('/profiles', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users,
      amt: users.length
    });
  });
});


// //unfollow button
router.post('/unfollow/:id', function(req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {
      res.status(404).send('No user');
    } else {
      if (req.user.isFollowing(user)) {
        req.user.unfollow(user);
        res.redirect('/users/' + id);
      } else {
        console.log('You do not follow this user.')
        res.redirect('/users/' + id);
      }
    }
  })
})

//follow button
router.post('/follow/:id', function(req, res) {
  var id = req.params.id;
  //console.log(id);
  User.findById(id, function(err, user) {
    if (err) {
      res.status(404).send('No user');
    } else {
      if (req.user.isFollowing(user)) {
        console.log('You are already following this user!');
        res.redirect('/users/' + id);
      } else {
        req.user.follow(user);
        res.redirect('/users/' + id);
      };
    };
  });
})


//api key: AIzaSyDOa6_XxT1SdAMDZCdksU2DHGrkG_v3Dgs
router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  var lat = '';
  var long = '';
  geocoder.geocode(req.body.address, function(err, data) {
    // console.log(err);
    // console.log(data);
    lat = data[0].latitude;
    long = data[0].longitude;

    if (err) {
      console.log('error with google API')
    } else {
      console.log(req.body.restaurantName);
      var newRestaurant = new Restaurant({
        name: req.body.restaurantName,
        category: req.body.category,
        latitude: lat,
        longitude: long,
        price: req.body.price,
        openingTime: req.body.openingTime,
        closingTime: req.body.closingTime
      });
      console.log(newRestaurant);
      newRestaurant.save(function(err, response) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/restaurant/new');
        } else {
          res.render('singleRestaurant', {
            restaurant: newRestaurant
          });
        }
      });
    }
  });
});

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    });
  });
});


module.exports = router;
