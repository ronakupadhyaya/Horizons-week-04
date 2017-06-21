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


router.get('/', function(req, res) {
  res.send('Home Page');
})

router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;

  User.findById(userId, function(err, user) {
      console.log('userId', userId);
    if(err || !user) {
      res.status(404).send("No user");
    } else {
      user.getFollows(function(err, result) {     //callback
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        console.log('rendered', { user: user, following: allFollowing, followers: allFollowers});
        res.render('singleProfile', {
          user: user,           //user in handlebars become user in function
          following: allFollowing,
          followers: allFollowers});
      })

    }
  })
});

router.get('/users/profiles', function(req,res) {
  res.render('profiles', {
    user: user
  })
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
