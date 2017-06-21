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
//is this how you render??
// router.get('/singleprofile', function(req, res, next){
//   res.render('singleProfile')
// })
router.get('/', function(req, res){
  res.render('singleProfile',{
    user: req.user
  })
})
router.get("/users/:userid", function(req,res){
  User.findById(req.params.userid, function(err,user){
    user.getFollows(req.params.userid, function(followers, following){
      res.render('singleProfile', {
        user:user,
        allFolowers: followers,
        allFollowings: following
      })
    })
  })
})
router.get('/allprofiles', function(req,res){
  User.find(function(err, users){
    res.render('profiles', {users: users})
  })
});
router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
});
module.exports = router;
