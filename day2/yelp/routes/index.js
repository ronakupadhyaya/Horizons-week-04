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
router.get('/', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users
    });
  });

});

router.get('/profile/:userid', function(req, res) {
  console.log(req.params);
  User.findById(req.params.userid, function(err, user) {
    if (!err) {
      res.render('singleProfile', {
        user: user
      });
    } else {
      console.log("Error finding user");
    }
  });

});

router.post('/follow/:userid', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    // TODO
  })
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
