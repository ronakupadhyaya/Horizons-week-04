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

router.get('/', function(req, res) {
  res.send('Home Page');
})

router.get('/users/:userId', function(req,res) {
  var userId = req.params.userId;
  User.findById(userId, function(err, user) {
    if(err || !user) {
      res.status(404).send("No user");
    } else {
      user.getFollows(userId,function(err, result) {
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        console.log('rendered', { user: user, following: allFollowing, followers: allFollowers});
        res.render('singleProfile', { user: user, following: allFollowing, followers: allFollowers});
      })
    }
  })



});

router.get('/users',function(req,res){
  Follow.find().exec(function(err, user){
    if (err){ console.log("YOU CAN'T LIST FOLLOWERS: " + err)}
    else {
      console.log("THIS IS A USER " + user)
      res.render('profiles' , {Users: user})}
  })
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

// router.get('/users/:userId', function(req, res){
//   var userId = req.params.userId
//   User.findById(userId, function(err,user){
//     if(err || !user){
//       res.status(404).send('Cannot be found')
//     }else if (){
//
//     }
//   })
//   res.render('profiles', {profiles: User})
// })

module.exports = router;
