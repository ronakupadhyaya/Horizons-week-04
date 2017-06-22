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
router.use(function (req, res, next) {
  console.log(req.user);
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurants/new', function (req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/profile/:profileId', function (req, res) {

  User.findOne({ _id: req.params.profileId })
    .exec(function (err, user) {
      if (err || !user) {
        /// ?? error, user not found
        return;
      }
      user.getFollows(function (followers, following) {
        // res.render('singleProfile', {
        //   user: user,
        //   following: following || [],
        //   followers: followers || []
        // })
        console.log(followers);
        console.log(following);
        Review.find({ userId: req.params.profileId })
          .exec(function (err, reviews) {
            // console.log(reviews);
            res.render('singleProfile', {
              user: user,
              following: following || [],
              followers: followers || [],
              reviews: reviews
            })
          })
      })

    })


});

router.get('/restaurants', function (req, res) {
  Restaurant.find(function (err, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
});

router.get('/restaurant/:restaurantId', function (req, res) {

  Restaurant.findOne({ _id: req.params.restaurantId })
    .exec(function (err, restaurant) {
      if (err || !restaurant) {
        return;
      }

      Review.find({ restId: req.params.restaurantId })
        .exec(function (err, reviews) {
          var stars = restaurant.averageRating;
          res.render('singleRestaurant', {
            restaurant: restaurant,
            reviews: reviews,
            stars: stars
          })
        })


    });
});

router.get('/newrestaurant', function (req, res) {

  res.render('newRestaurant');

});


router.post('/newrestaurant', function (req, res) {

  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    open: req.body.open,
    close: req.body.close
  });
  restaurant.save(function (err, succ) {
    console.log(err, succ);
    // Restaurant.find(function (err, restaurants) {
    //   res.render('restaurants', {
    //     restaurants: restaurants
    //   })
    // })
    res.redirect('/restaurant/' + this._id);
  });
});

router.get('/restaurant/:id/review', function (req, res) {
  Restaurant.findOne({ _id: req.params.id }, function (err, restaurant) {
    res.render('newReview', {
      restaurant: restaurant,
      restaurantId: req.params.id
    });
  });
});

router.post('/restaurant/:id/review', function (req, res) {
  console.log('received post')
  var review = new Review({
    content: req.body.review,
    stars: req.body.stars,
    restId: req.params.id,
    userId: req.user._id
  });
  console.log(req.body);
  console.log(req.user._id);
  review.save(function (err, e) {
    if (err) {
      console.log(err);
      res.send('error!');
    } else {
      res.redirect('/restaurant/' + req.params.id);
    }
  });

});

router.get('/test', function (req, res) {
  // req.user.
  User.findById(req.user._id, function (err, result) {
    result.follow('5949a828da92e8fa089b1984', function (err, f) {
      console.log(err);
      console.log(f);
      res.send('test');
    })
  })
});

// when making follow route, makke sure to not allow duplicate follows

module.exports = router;