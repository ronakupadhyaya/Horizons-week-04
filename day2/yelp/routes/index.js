var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var exphbs = require('express-handlebars');

var hbs = exphbs.create({
  helpers: {
    bar: function(person) {
      return true
    }
  }
})

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
//   httpAdapter: "https",
//   formatter: null
// });

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
    res.redirect('/users/' + req.params.id)
  })
})

router.get('/profiles', function(req, res, next) {
  User.find({}, function(err, arr) {
    res.render('profiles', {
      users: arr,
      testing: arr[0]._id,
      helpers: {
        foo: function() {
          return true;
        },
        following: function(person) {
          req.user.isFollowing(person, function(bool) {
            return bool;
          })
        }
      }
    })
  })
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;