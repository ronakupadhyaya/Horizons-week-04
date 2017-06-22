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

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/users/:userId', function(req, res){
  User.findById(req.params.userId, function(err, user){
    if(err || !user){
      res.status(404).send('No user');
    }
    else{
      user.getFollows(function(err, result){
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        res.render('singleProfile', {
          user: user,
          following: allFollowing,
          followers: allFollowers
        })
      })
    }
  });
})

// GET Profiles page
router.get('/', function(req, res){
  User.find(function(err, user){
    if(err){
      res.status(404).send('No users');
    }
    else{
      res.render('profiles', {
        user: user
      });
    }
  })
})

router.post('/follow/:id', function(req, res){
  var currentId = req.user._id;
  Follow.find({from: currentId, to: req.params.id}, function(err, foundFollow){
    console.log("THIS IS THE FOUND FOLLOW: " + foundFollow);
    if(err){
      console.log(err);
    }
    if(!foundFollow){
      console.log("You are already following this person!");
    }
    else{
      var newFollow = new Follow({
        from: currentId,
        to: req.params.id
      })
      newFollow.save(function(err, result){
        if(err){
          console.log(err);
        }
        else{
          console.log(result);
        }
      })
    }
    res.redirect('/users/'+currentId);
  })
})

router.post('/unfollow/:id', function(req, res){
  req.user.unfollow(req.params.id, function(err, foundFollow){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundFollow);
    }
    res.redirect('/users/'+req.user._id);
  })
})

module.exports = router;
