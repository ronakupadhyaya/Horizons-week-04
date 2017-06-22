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


router.get('/', function(req, res){
  var userId = req.user._id;
  // User.findOne(function(err, users){
  //
  //   userId = users.id;
  // })

  console.log("This is userId: " + userId);
  res.redirect(`/users/${userId}`);

// User.findById(req.user._id, function(err, user) {
//   user.follow(function(err) {
//
//   })
// })

})

router.get('/users', function(req, res){
  User.find(function(err, users) {
    res.render('profiles', {
      users: users,
    });
  });
})

router.post('/follow/:userId', function(req, res){

  // User.findById(req.params.userId, function(err, user) {
  //   user.follow(function(err, user) {
  //     res.render('singleProfile', {user: user, following: allFollowing, followers: allFollowers});
  //   })
  // })
  req.user.follow(req.params.userId, function(err) {
    console.log(err);
    res.redirect(`/users/${req.params.userId}`);
  });
});

router.get('/unfollow/:userId', function(req, res){
  req.user.unfollow(req.params.userId, function(err) {
    res.redirect(`/users/${req.params.userId}`);
  });
});

router.get('/users/:userId', function(req, res) {
  var userId = req.params.userId;

  User.findById(userId, function(err, user) {
    if(err || !user) {
      res.status(404).send("No user");
    } else{
      user.getFollows(function(err, result){
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        // console.log("big fat potato")
        // console.log(result)
        console.log('rendered', {user: user, following: allFollowing, followers: allFollowers});
        res.render('singleProfile', {user: user, following: allFollowing, followers: allFollowers});
      })
    }
  })
});

router.post('/restaurants/new', function(req, res, next) {
  // res.render('newRestaurant');
  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
