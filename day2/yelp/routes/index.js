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

router.get('/user/:userId', function (req, res) {
  var userId = req.params.userId;
  User.findById(userId, function (err, user) {
    if (err) {
      res.status(404).send('NO USER!!!')
    } else {
      user.getFollows(function (err, followObj) {
        var doesFollow = false;
        followObj.allFollowers.forEach(function(element) {
          if (element.fromId._id + "" == req.user._id + "") {
            doesFollow = true;
          }
      });
      var self = (userId + "" === req.user._id + "");
      console.log(self);
        res.render('singleProfile', {
          user: user,
          following: followObj.allFollowing,
          followers: followObj.allFollowers,
          doesFollow: doesFollow,
          notSelf: !self
        })
      });
    }
  })
})

router.post('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function(err) {
    if (err) {
      res.send(new Error('ERROR!!!'));
    } else {
      res.redirect('/all');
    }
  })
})

router.post('/follow/:userId', function(req, res) {
  req.user.follow(req.params.userId, function(err) {
    if (err) {
      res.send(new Error('ERROR!!!'));
    } else {
      res.redirect('/all');
    }
  })
})

router.get('/all', function (req, res) {
  User.find(function (err, users) {
    res.render('profiles', {
      users: users
    })
  })
})

module.exports = router;