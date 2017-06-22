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

router.get('/users/:id', function(req, res){
  User.findById(req.params.id, function(err, docs) {
    if(err) {console.log(err);}
    docs.getFollows(req.params.id, function(err, isFollowing, allFollowers) {
      if(err) {console.log(err);}
      res.render('singleProfile', {
        user: user,
        following: allFollowing,
        followers: allFollowers
      })
    })
  })
})

router.get('/users', function(req, res){
  User.find().exec(function(err, users){
    if(err){ console.log(err)}
    res.render('profiles', {
      user: users
    })
  })
})

router.post('/follow/:userId2', function(req, res){
  req.user.follow(req.params.userId2, function(){
    res.redirect('/users/' + req.params.userId2)
  })
})

router.post('/unfollow/:userId2', function(req,res) {
    req.user.unfollow(req.params.userId2, function(){
      res.redirect('/users/'+req.params.userId2)
    })
})

// router.get('/users', function(req, res){
//   User.find().exec(function(error, users){
//     res.render('profiles', {
//       users: users
//     })
//   })
// })

router.get('/restaurants', function(req, res){
  Restaurant.find({}, function(err, arr){
    if(err) { console.log(err); }
    else {
      res.render('restaurants', arr);

    }
  })
})

router.get('/restaurants/:id', function(req, res){
  Restaurant.findById(req.params.id, function(err, restaurant){
    if(err) {console.log('error cannot find restaurant')}
    res.render('singleRestaurant', Restaurant)
  })
})

router.get('/newrestaurant', function(req, res){
  res.render('newRestaurant');
})

router.post('/newrestaurant', function(req, res){
  var newRestaurant = new Restaurant({
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
    openTime: parseInt(req.body.closingTime),
    closingTime: parseInt(req.body.closingTime)
  })

  newRestaurant.save(function(err){
    if(err) {return ('error could not save new restaurant');}
    res.redirect('/restaurants');
  })
})
module.exports = router;
