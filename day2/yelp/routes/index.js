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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDKySPQbFQTKFiGpSfM9gvnRDfUO3MDkxs",
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

router.get('/users/:userId',function(req,res){
  var userId=req.params.userId;
  User.findById(userId, function(err,user){
    if(err||!user){
      res.status(404).send("No user");
    }else{

      user.getFollows(function(err,result){
        var allFollowing=result.following;
        var allFollowers=result.followers;

        res.render('singleProfile',{user:user, following:allFollowing, followers:allFollowers})
      })

    }
  })
})

router.get('',function(req,res){
  res.render('review')

})

router.post( ,function(req,res){
  res.redirect(/users/:userId)
})

router.get('/users',function(req,res){

 User.find(function(err,users){
   if(err){
     res.status(500)
   }else{
     res.render('profiles',{Users:users})

   }

 })


})
router.get('/restaurants', function(req, res){
  Restaurant.find(function(err,rest){
    if(err){
      res.status(500)
    }else{
      res.render('restaurants',{restaurants:rest})
    }
  })


})

router.get('/restaurants/new',function(req,res){
  res.render('newRestaurant')
})

router.get('/restaurants/:restId',function(req,res){
  var id=req.params.restId;
  Restaurant.findById(id,function(err, restu){
    if(err){
      res.status(500)
    }else{
      res.render('singleRestaurant',{resta:restu,
        review:restu.getReviews(),
        rating:restu.rating

      })
    }
  })
})





router.post('/restaurants/new', function(req, res, next) {


  geocoder.geocode(req.body.address, function(err, data) {

    var newRest= new Restaurant({
      name:req.body.name,
      relativePrice:parseInt(req.body.relativePrice),
      category:req.body.category,
      openTime:req.body.openTime,
      closeTime:req.body.closeTime,
      latitude: data[0].latitude,
      longitude: data[0].longitude
     })

     newRest.save(function(e, saved) {
       res.redirect('/restaurants')
     })


  });




});

module.exports = router;
