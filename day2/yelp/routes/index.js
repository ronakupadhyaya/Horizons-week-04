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
  User.find({}, function(err, all){
    res.render('profiles', {
      users: all
    });
  })
})

router.get('/users/:userId', function(req, res){
  var userId = req.params.userId;
  req.user.getFollows(userId, function(allFollowing, allFollowers){
    User.findById(userId, function(err, user){
      var isFollowing = false;
      req.user.isFollowing(userId, function(following){
        isFollowing = following;
      })
      res.render('singleProfile', {
        user: user,
        following: allFollowing,
        followers: allFollowers,
        //reviews: TODO
        isFollowing: isFollowing
      })
    })
  });
})

router.post('/follow/:userId', function(req, res){
  var userId = req.params.userId;
  var currentUserId = req.user._id;
  Follow.findOne({to: userId, from: currentUserId}, function(err, followObj){
    if(err){
      console.log(err);
    } else if(followObj) {
      console.log("you're already following this person!");
    } else {
      var newFollow = new Follow({
        to: userId,
        from: currentUserId
      });
      newFollow.save(function(err){
        if(err){
          console.log(err);
        } else {
          console.log('Successfully following!');
        }
      })
    }
    res.redirect('/users/'+userId);
  })
});

router.post('/unfollow/:userId', function(req, res){
  req.user.unfollow(req.params.userId, function(err){
    if(err){
      console.log('Error');
    } else {
      console.log('Successfully unfollowed!');
    }
    res.redirect('/users/'+req.params.userId);
  });
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
