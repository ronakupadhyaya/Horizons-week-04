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
  apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
  httpAdapter: "https",
  formatter: null
});
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

// router.get('/followAdd', function(req, res) {
//   var from = '5949a3272ec45b1dffdd0fa1';
//   var to = '5949a33b2ec45b1dffdd0fa3';
//   User.findById(to, function(err, user) {
//     console.log(user);
//
//     user.followTest(to, from, function(err, result) {
//       if (err) console.log(err);
//       else {
//         console.log(result);
//       }
//     })
//   })
// })
router.post('/follow/:id', function(req, res) {
  var id = req.params.id;
  var userId = req.user.id;
  req.user.follow(id, function(err, result) {
    if (err) console.log(err);
    else {
      if (result === true) {
        console.log('already followed');
        res.redirect(`/users/`);
      } else {
        result.save(function(err) {
          if (err) console.log(err);
          else {
            console.log('following secceeded');
            res.redirect(`/users/${userId}`);
          }
        })
      }

    }
  })
})

router.post('/unfollow/:id', function(req, res) {
  var id = req.params.id;
  var userId = req.user.id;
  // console.log(req.user);
  User.findById(userId, function(err, user) {
    user.unfollow(id, function(err) {
      if (err) console.log(err);
      else {
        res.redirect(`/users/${userId}`);
        console.log('unfollow succeed');

      }
    })

  })
})

router.get('/users', function(req, res, next) {
  User.find(function(err, users) {
    if (err) console.log(err);
    res.render('users', {
      users: users
    });
  });
});

router.get('/users/:id', function(req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) console.log(err);
    else {
      user.getFollows(id, function(err, followers, following) {
        if (err) console.log(err);
        else {
          // console.log(user);
          // console.log(followingData);
          res.render('singleProfile', {
            user: user,
            Following: following,
            Followers: followers
          })

        }

      })
    }
  })

})
// THE WALL - anything routes below this are protected!
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});


router.post('/restaurants/new', function(req, res, next) {
  var address = req.body.address;
  var name = req.body.name;
  var category = req.body.category;
  var price = req.body.price;
  var openTime = req.body.openTime;
  var closeTime = req.body.closeTime;
  geocoder.geocode(address, function(err, data) {
    // console.log(data);
    var latitude = data[0].latitude;
    var longitude = data[0].longitude;

    var singleRes = new Restaurant({
      name: name,
      category: category,
      latitude: latitude,
      longitude: longitude,
      price: price,
      openTime: openTime,
      closeTime: closeTime,
      address: address
    })
    singleRes.save(function(err, result) {
      if (err) console.log(err);
      else {
        res.redirect('/restaurants');
      }
    });
  });
});
router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
  // Geocoding - uncomment these lines when the README prompts you to!
});
router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants) {
    if (err) console.log(err);
    else {
      // console.log(restaurants);
      res.render('restaurants', {
        restaurants: restaurants
      })
    }
  })
})
router.get('/restaurants/:id', function(req, res, next) {
  var id = req.params.id;
  Restaurant.findById(id, function(err, restaurant) {
    if (err) console.log(err);
    else {
      res.render('singleRestaurant', {
        restaurant: restaurant
      })
    }
  })
})
module.exports = router;
