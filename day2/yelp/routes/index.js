var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var validator = require('express-validator')
var NodeGeocoder = require('node-geocoder');

router.use(validator())

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCWuRRwy_bQk3GUg_Jn7LYytQhMFOM9C5g",
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

//home page route gets hit after login
router.get('/', function(req, res){
  res.render('home')
})

//rendering profiles using profiles.hbs
router.get('/profiles', function(req, res){
  User.find().exec(function(err, users){
    res.render('profiles',{
      users: users
    })
  })
})

//render the restaurant using restaurant.hbs
router.get('/restaurants', function(req, res){
  Restaurant.find().exec(function(err, users){
    res.render('restaurants',{
      users: users
    })
  })
})

//render newRestaurant signup
router.get('/newRestaurant', function(req, res) {
  res.render('newRestaurant', {error: null});
});

//form of newRestaurant is submitted
router.post('/newRestaurant', function(req, res) {
  //validate form
  req.checkBody('restaurantName', 'name is not inserted').notEmpty();
  req.checkBody('price', 'price is not inserted').notEmpty();
  req.checkBody('address', 'address is not inserted').notEmpty();
  req.checkBody('openTime', 'openTime is not inserted').notEmpty();
  req.checkBody('closingTime', 'closingTime is not inserted').notEmpty();
  var errors = req.validationErrors()

  //if there are errors re render the form
  if(errors){
    res.render('/newRestaurant',{
      restaurantName: req.body.restaurantName,
      price: req.body.price,
      address: req.body.address,
      openTime: req.body.openTime,
      closingTime: req.body.closingTime,
      error: errors,
    })
  }

  //find lat and long using geocoder from address
  var lat;
  var long;
  geocoder.geocode(req.body.address, function(err, data) {
    lat = data[0].latitude;
    long = data[0].longitude;
    console.log(lat);
    console.log(long);
    //make new Restaurant
    var u = new models.Restaurant({
      name: req.body.restaurantName,
      price: req.body.price,
      category: req.body.sortCategory,
      longitude:long,
      latitude: lat,
      openTime: (req.body.openTime).to_i,
      closingTime: (req.body.closingTime).to_i,
    });

    //saving the new restaurant
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/newRestaurant');
      }
      res.redirect('/restaurants');
    });
  });

});

//rendering my profile this needs to be different now because of
//tryin to hide follow and unfollow buttons
router.get('/profile', function(req, res){
  var followers;
  var following;

  req.user.getFollows(function(following, followers){
    followers = followers;
    following = following;
    res.render('myProfile', {
      user: req.user,
      following: following,
      followers: followers
    })
  })
})

//this gets the individual profiles by their own profile id
router.get('/profile/:profileid', function(req, res){
  var id = req.params.profileid
  var myProfile = req.user
  User.findById(id, function(err, profile){
    if(err){
      console.log('didnt find profile object, database error')
    }
    profile.getFollows(function(following, followers){
      myProfile.isFollowing(id, function(bool){
        console.log(bool)
        notBool = !bool
        res.render('singleProfile', {
          user: profile,
          following: following,
          followers: followers,
          isFollowing: bool,
          notIsFollowing: notBool,
        })
      })
    })
  })
})

//posting the follow and unfollow requests of the individual profiles
router.post('/profile/:profileid', function(req, res){
  var id = req.params.profileid
  var myProfile = req.user
  if(req.body.buttonType === 'follow'){
    myProfile.follow(id, function(err, success){
      if(err){
        console.log('error in saving follower', err)
      }
      console.log('success in saving', success)
      res.send(200)
    })
  }else{
    myProfile.unfollow(id, function(err, success){
      if(err){
        console.log('error in removing follower', err)
      }
      console.log('success in removing', success)
      res.send(200)
    })
  }
})

//this route gets hit when i unfollow a user from my profile
router.post('/unfollow/:id', function(req, res){
  var id = req.params.id
  var myProfile = req.user
  var myId = req.user._id
  myProfile.unfollow(id, function(err, success){
    if(err){console.log("error in unfollowing in unfollow button", err)}
    res.redirect('/profile')
  })
})

//this renders the individual restaurant
router.get('/restaurant/:restaurantId', function(req, res){
  var resId = req.params.restaurantId;
  Restaurant.findById(resId, function(err, restaurant){
    if(err){
      console.log('error in finding restaurant')
    }
    //reversing long and lat properites
    geocoder.reverse({lat: restaurant.latitude, lon: restaurant.longitude}, function(err, result) {
      console.log(result);
      //rendering all of the restauran object as well as the address
      res.render('singleRestaurant',{
        restaurant: restaurant,
        address: result[0].formattedAddress,
      })
    });
  })
})



module.exports = router;
