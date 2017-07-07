var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

var expressValidator = require('express-validator');

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

router.get('/', function(req, res) {
  var followers;
  var following
  req.user.getFollowers(function(followers) {
    console.log('followers: ' + followers)
    req.user.getFollowing(function(following) {
      console.log('following: ' + following)
      res.render('singleProfile', {
        user: req.user,
        followers: followers,
        following: following
      })
    })
  });


})

router.get('/profiles', function(req, res) {
  User.find(function(err, users) {
    if (err) {
      console.log('could not load users')
    } else {
      console.log('users.length: ' + users.length)
      res.render('profiles', {
        users: users
      })
    }
  })

})

router.post('/follow/:userid', function(req, res) {
  var userid = req.params.userid;
  if (userid !== String(req.user._id)) {
    req.user.follow(userid)
    res.redirect('/')
  } else {
    res.redirect('/profiles')
  }
})

router.post('/unfollow/:userid', function(req, res) {
  Follow.findOneAndRemove({from: String(req.user._id), to: req.params.userid}, function(err) {
    if (err) {
      console.log('could not unfollow')
      res.redirect('/')
    } else {
      console.log('unfollow successful')
      res.redirect('/')
    }
  })
})

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant')
})

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  console.log(req.body.openTime)

  new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price.length,
    address: req.body.address,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
    reviewCount: 0,
    totalScore: 0
  }).save(function(err, restaurant) {
    if (err) {
      console.log("Could not create new restaurant")
      res.redirect('restaurants/new')
    } else {
      console.log("New restaurant created")
      res.redirect('/restaurants/'+restaurant._id)
    }
  })

});

router.get('/restaurants/:restaurantid', function(req, res) {
  Restaurant.findById(req.params.restaurantid, function(err, restaurant) {
    restaurant.getReviews(function(reviews) {
      res.render('singleRestaurant', {
        restaurant: restaurant,
        reviews: reviews
      })
    })
  })
})

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    console.log('restaurants: ' + restaurants)
    res.render('restaurants', {restaurants: restaurants})
  })
})

router.get('/restaurants/review/:restaurantid', function(req, res) {
  var restaurantid = req.params.restaurantid
  Restaurant.findById(restaurantid, function(err, restaurant) {
    if (err) {
      console.log('could not find restaurant to review')
    } else {
      res.render('newReview', {
        restaurant: restaurant
      })
    }
  })
})

router.post('/restaurants/review/:restaurantid', function(req, res) {
  var reviewContent = req.body.content;
  var starAmount = parseInt(req.body.stars);
  var userid = String(req.user._id);
  var restaurantid = req.params.restaurantid

  new Review({
    content: reviewContent,
    stars: starAmount,
    user: userid,
    restaurant: restaurantid
  }).save(function(err) {
    if (err) {
      console.log("could not save new review")
      res.redirect('restaurants/review/'+restaurantid)
    } else {
      Restaurant.findById(restaurantid, function(err, restaurant) {
        console.log('we here: ' + restaurant)
        restaurant.reviewCount = restaurant.reviewCount + 1
        restaurant.totalScore = restaurant.totalScore + starAmount
        res.redirect('/restaurants/'+restaurantid)
      })

    }
  })
})

module.exports = router;
