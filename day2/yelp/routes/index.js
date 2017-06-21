var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || require('../connect').GEOCODING_API_KEY,
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('/profiles',function(req,res) {
  User.find().exec(function(err,allUser){
    res.render('profiles',{
      users: allUser
    });
  });
});

router.get('/users/:id',function(req,res){
  var id = req.params.id;
  User.findById(id,function(err,foundUser) {
    foundUser.getFollowers(function(err,allFollowing,allFollowers) {
      if (err){res.send(err);return;}
      console.log("allllll",allFollowers,allFollowing)
      foundUser.getReviews(function(err,reviews) {
        res.render('singleProfile', {
          user:foundUser,
          reviews:reviews,
          following:allFollowing,
          followers:allFollowers
        })
      })
    })
  })
});

router.get('/restaurants/new',function(req,res) {
    res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {
  var newRestaurant = new Restaurant({
    name:req.body.name,
    category:req.body.category,
    latitude:req.body.latitude,
    longitude:req.body.longitude,
    price:req.body.price,
    openTime:req.body.openTime,
    closingTime:req.body.closingTime
  });
  newRestaurant.save(function(err,saved) {
    if (err) {console.log(err);return}
    res.redirect('/restaurants')
  })
});

router.get('/restaurants',function(req,res) {
  Restaurant.find().exec(function(err,allRests) {
    res.render('restaurants',{
      restaurants: allRests,
      userId:req.user
    })
  })
})

router.get('/logout',function(req,res) {
  req.logout();
})

router.get('/restaurants/:id',function(req,res) {
  var restId = req.params.id;
  Restaurant.findById(restId).exec(function(err,foundRest) {
    foundRest.getReviews(function(err,reviews) {
      if (err) {console.log("databaseerror");return;}
      if (foundRest === null) {
        res.send("didn't find restaurant");
      } else{
        console.log(foundRest.latitude,foundRest.longitude)
        res.render('singleRestaurant',{
          restaurant:foundRest,
          reviews:reviews
        })
      }
    });
  })
})

router.get('/review/:restaurantid',function(req,res) {
  res.render('newReview',{
    restaurantid:req.params.restaurantid
  })
})

router.get('/follow/:userid',function(req,res){
  var userid = req.params.userid;
  var currentUser = req.user;
  currentUser.follow(userid,function(err,result){
    res.redirect('/restaurants');
  })
});

router.get('/unfollow/:userid',function(req,res){
  var userid = req.params.userid;
  var currentUser = req.user;
  currentUser.unfollow(userid,function(err,result) {
    res.redirect('/restaurants');
  })
});

router.post('/review/:restaurantid',function(req,res) {
  var restaurantid = req.params.restaurantid;
  var newReview = new Review({
    content:req.body.content,
    star:req.body.stars,
    restaurantId:restaurantid,
    userId:req.user._id
  })
  newReview.save(function(err,saved){
    if (err){res.send(err);return;}
    res.redirect('/restaurants/'+restaurantid)
  });
})

module.exports = router;
