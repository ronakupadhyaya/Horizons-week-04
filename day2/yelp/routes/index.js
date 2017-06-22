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

// <<<<<<< HEAD
// router.get('/', function(req, res){
//   // console.log("user", req.user);
//   var followers = [];
//   var following = [];
//   req.user.getFollows(req.user._id, function(followers, following){
//     followers = followers;
//     following = following;
//   })
//   res.render('singleProfile', {
//     user: req.user,
//     following: following,
//     followers: followers
//   })
// })

//profile.hbs
router.get('/all', function(req, res){
  User.find(function(err, users){
    if(err) {console.log("Error on all profiles", err);}
    else{
      res.render('profiles', {
        users: users
      })
    }
  })
})

// =======
router.get('/', function(req, res) {
  res.send('Home Page');
})

router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;
  console.log('userId', userId);

  User.findById(userId, function(err, user) {
    if(err || !user) {
      res.status(404).send("No user");
    } else {
      user.getFollows(function(err, result) {
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        console.log('rendered', { user: user, following: allFollowing, followers: allFollowers});
        res.render('singleProfile', { user: user, following: allFollowing, followers: allFollowers});
// >>>>>>> step1GWSCodealong
      })
    }
  })
});

router.post('/follow/:toId', function(req, res){
  var idToFollow = req.params.toId;
  console.log("fromId", req.user._id, "toId", idToFollow);
  req.user.follow(idToFollow, function(err) {
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
