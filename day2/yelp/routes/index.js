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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAZebP_BhoNoz1LKFVtESDfHY81Ig3oAS8",
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

router.get('/',function(req,res){
  res.send('home page')
})

router.get('/users/:userid',function(req,res) {
  var userId=req.params.userid
  User.findById(userId,function(err,user){
    if(err ||!user){
      res.status(404).send('No user')
    }
    else{
      user.getFollows(function(err, result){
        var allFollowing = result.allFollowing
        var allFollowers = result.allFollowers

        res.render('singleProfile', {user:user})
      })
    }
  })
})


router.get('/restaurants/all', function(req, res){
  //console.log(Restaurant);
  Restaurant.find(function(err, restaurants){
    if (err){
      // console.log(err);
    }
    else{
      res.render('restaurants', {
        restaurants: restaurants
      })
    }
  })
})
router.get('/restaurants/new', function(req, res){
  res.render('newRestaurant')
})

router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.restaurantLocation, function(err, data) {
    console.log(err);
    console.log(data);
    //console.log("@@@@@@@@@" + data[0].longitude);
  });

  var newR= new models.Restaurant({
    name: req.body.restaurantName,
    category: req.body.restaurantCategory,
    latitude: parseInt(req.body.restaurantLocation),
    longitude: parseInt(req.body.restaurantLocation),
    price: parseInt(req.body.restaurantPrice),
    openTime: parseInt(req.body.openTime),
    closeTime: parseInt(req.body.closeTime)
  });
  newR.save(function(err, newres){
    if(err){
      // console.log(err);
    }
    else{
      res.redirect("/restaurants/all")
    }
  })
});
router.get("/restaurants/:rid", function( req, res){
  Restaurant.findById(req.params.rid, function(err, r){
    if (err){
      console.log(err);
    }
    else{
      res.render('singleRestaurant',{
        restaurant: r
      })
    }
  })
})

module.exports = router;
