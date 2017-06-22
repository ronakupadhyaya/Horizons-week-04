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
  apiKey: 'AIzaSyC-yEz1V0lOnwcCRlZLv0O_0coMpR89N_0',
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

router.post('/follow/:user_id', function(req, res){
  req.user.follow(req.params.user_id, function(){
    res.redirect('/users/' + req.params.user_id);
  })
});

router.post('/unfollow/:user_id', function(req, res){
  req.user.unfollow(req.params.user_id, function(){
    res.redirect('/users/' + req.params.user_id);
  })
});

router.get('/users/:user_id', function(req, res){
  User.findById(req.params.user_id, function(err, user){
    if (err){
      console.log('Error loading single profile page')
    }
    else{
      user.getFollows(function(following, followers){
        //console.log('here',following, followers,req.user.isFollowing(req.params.user_id),req.user, req.params.user_id);
        var inner;
        req.user.isFollowing(req.params.user_id, function(result){
          inner = !!result;
          res.render('singleProfile', {
            user: user,
            reviews: null,
            following: following,
            followers: followers,
            isfollowing: inner
          })
        });

      })
    }
  });
});

router.get('/users', function(req, res){
  User.find(function (err, users) {
    if (err){
      console.log('Error loading users directory')
    }
    else{
      res.render('profiles', {
        users:users
      })
    }
  })
});


router.get('/restaurants', function(req,res, next){

  res.render('restaurants')

});

router.get('/restaurants/single/:rest_id', function(req,res, next){

  Restaurant.findById(req.params.rest_id, function(err, restaurant){
    var price = [];
    for (var i=0; i<restaurant.price; i++){
      price.push(0);
    }
    res.render('singleRestaurant', {
      restaurant:restaurant,
      relPrice: price,
    })
  });


});

router.get('/restaurants/new', function(req,res, next){

  res.render('newRestaurant');

});

router.post('/restaurants/new', function(req, res, next) {

  var lat;
  var long;
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
    lat=data[0].latitude;
    long=data[0].longitude;

    var restaurant = new Restaurant({
      name: req.body.restaurant,
      category: req.body.category,
      price: req.body.price,
      latitude: lat,
      longitude: long,
      openTime:req.body.openTime,
      closeTime: req.body.closeTime
    });

    restaurant.save(function(err,rest){
      if (err){
        console.log(err);
        res.redirect('/users')
      }
      else{
        console.log(rest);
        res.redirect('/restaurants/single/' + rest._id)
      }
    })
  });

});

module.exports = router;
