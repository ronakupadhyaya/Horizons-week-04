var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: "AIzaSyDwGqKmQlmM-6jzhhhYhTDvYC0NBV0fNtg",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users/:id', function(req, res, next){
  var ourId = req.user.id;
  var profileId = req.params.id;
  User.findById(profileId, function(err, user){
    if(err){
      res.json({failure: err});
    } else {
      user.getFollows(user.id, function(followers, following) {
        // checking to make sure we are not on our own page
        var notUser;
        if (req.user.id === user.id) {
          notUser = false;
        } else {
          notUser = true;
        }
        // including isFollowing into following array
        following.forEach(function(followDoc) {
          if (followDoc.userIdFrom.toString() === req.user.id) {
            followDoc.isFollowing = true;
          } else {
            followDoc.isFollowing = false;
          }
        })

        res.render('singleProfile', {
          user: user,
          following: following,
          followers: followers,
          notUser: notUser,
        })
      })
    }
  })
});

router.post('/follow/:id', function(req, res) {
  req.user.follow(req.params.id)
  res.redirect('/')
})

// router.get('/follow/:id', function(req, res) {
//   var userId = req.user.id
//   res.redirect('/')
// })

router.post('/unfollow/:id', function(req, res) {
  req.user.unfollow(req.params.id)
  res.redirect('/')
})

// router.get('/unfollow/:id', function(req, res) {
//   var userId = req.user.id
//   res.redirect('/')
// })

router.get('/', function(req, res) {
  User.find()
  .lean()
  .exec(function(err, users) {
      req.user.getFollows(req.user.id, function(followers, following) {
        users.forEach(function(user, ind) {
        following.forEach(function(followDoc) {
          if (followDoc.userIdTo.id.toString() === user._id.toString()) {
            user.isFollowingUser = true;
          }
          if(user._id.toString() !== req.user.id.toString()) {
            user.itIsNotMe = true;
          }
          // var notUser;
          // if (req.user.id === user.id) {
          //   notUser = false;
          // } else {
          //   notUser = true;
          // }
        })
      })
      res.render('profiles', {
       users: users,
      })
    })
  })
})

router.get('/restaurants/new', function(req,res) {
  res.render('newRestaurant')
})

router.get('/restaurants/:id', function(req,res) {
  Restaurant.findById(req.params.id, function(err, restaurant){
    res.render('singleRestaurant', {
      restaurant: restaurant,
      longitude: restaurant.longitude,
      latitude: restaurant.latitude
    })
  })
})

router.post('/restaurants/new', function(req, res) {

  geocoder.geocode(req.body.Address, function(err, data) {
    console.log(err);
    console.log(data);
    console.log(typeof data[0].latitude);
    var newRestaurant = new Restaurant ({
      name: req.body.Name,
      category: req.body.Category,
      price: req.body.Price,
      openTime: req.body.openTime,
      closeTime: req.body.closeTime,
      latitude: data[0].latitude,
      longitude: data[0].longitude
    })
    newRestaurant.save(function(err){
      if(err){
        console.log(err);
      } else {
        console.log({success: "New Restaurant Saved!!!"})
        res.redirect('/');
      }
    })


  });
});

module.exports = router;
