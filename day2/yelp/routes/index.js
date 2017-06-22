var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var restaurantList = require('../models/restaurantList')

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

router.get('/users', function(req,res){
  User.find()
    .where('_id').ne(req.user._id)
    .exec(function(err, users){
      if (err || !users) {
        res.status(404).send('Something went wrong');
      } else {
        res.render('profiles', {
          users: users
        });
      }
    });
});

router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;
  console.log('userId', userId);

  User.findById(userId, function(err, userInQ) {
    if(err || !userInQ) {
      res.status(404).send("No user");
    } else {
      console.log(`userInQ is ${userInQ}`);
      userInQ.getFollows(function(err, result) {
        if (err) {
          res.status(401).send('you suck');
        } else {
          console.log(results);
          var allFollowing = result.allFollowing;
          var allFollowers = result.allFollowers;
          console.log('rendered', { user: user, following: allFollowing, followers: allFollowers});
          res.render('singleProfile', { user: user, following: allFollowing, followers: allFollowers});
        }
      });
    }
  });
});

router.post('/users/:userId/follow', function(req,res){
  var self = req.user;
  var toBeFollowed = req.params.userId;
  self.follow(toBeFollowed, function(err, follow) {
    if (err) {
      // console.log(err);
      res.status(404).send('problem following')
    } else {
      res.redirect('/users')
    }
  });
});

router.get('/restaurants/new', function(req, res){
  res.render('newRestaurant', {
    restaurantList: restaurantList
  });
});

router.post('/restaurants/new', function(req, res, next) {


  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/restaurants/:restaurantId', function(req, res){
  var restId = req.param.restaurantId;
  Restaurant.findById(restId, function(err, restaurant){
    if (err) {
      res.status(404).send('restaurant not found:', err)
    } else {
      res.render('singleRestaurant', {
        
      });
    }
  });
});

module.exports = router;
