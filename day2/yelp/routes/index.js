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
  apiKey: "AIzaSyDyb_Lc5KKnnkH_S5QoA1x7UOco82-7zac",
  httpAdapter: "https",
  formatter: null
});

"AIzaSyDGyvwOU1cFh8ZNjDIUhLaOHr8jSSof5VU"




// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//send to homepage and show all current profiles
router.get('/', function(req, res) {
  User.find(function(err, users){
    if (err|| !users){
      res.status(404).send("no users")
    } else{
      res.render('profiles', {
        users: users
      })
    }
  })
})

//see profile of specific user
router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;
  // console.log('userId', userId);

  User.findById(userId, function(err, user) {
    if(err || !user) {
      res.status(404).send("No user");
    } else {
      user.getFollows(function(err, result) {
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        // console.log('rendered', { user: user, following: allFollowing, followers: allFollowers});
        res.render('singleProfile', { user: user, following: allFollowing, followers: allFollowers});
      })
    }
  })


});



router.get('/restaurants/new', function(req,res){
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res) {

  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
  });
  console.log("pppp", req.body)
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime:req.body.closingTime
  });

  console.log(restaurant)

  //saving the restaurant
  restaurant.save(function(err, restaurant){
    if(err){
      res.status(500).send("error saving the restaurant")
    } else{
      res.redirect('/restaurants');
    }
  })
});


router.get('/restaurants', function(req,res){
  Restaurant.find(function(err, restaurants){
    if(err){
      res.status(400).send("error in finding display restaurants");
    } else{
      res.render('restaurants', {
        restaurants: restaurants
      })
    }
  })
})


module.exports = router;
