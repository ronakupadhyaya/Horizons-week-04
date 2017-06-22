var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

router.get('/users/:id', function(req, res, next) {
  var id = req.params.id
  User.findById(id, function(err, user) {
    req.user.isFollowing(id, function(err, found){
      res.render('singleProfile', {
        user: user,
        following: found
      })
    })
    
  }) 
})

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

router.get('/', function(req, res, next) {
  console.log(req.user)
  res.render('singleProfile', {user: req.user})
})

router.get('/allUsers', function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('profiles', {users: users})
  }) 
})

router.post('/follow/:userid', function(req,res){
  var userid = req.params.userid
  var myid = req.user._id
  var followObj = new Follow({
    UserIdFrom: myid,
    UserIdTo: userid
  })
  followObj.save(function(err,follow){
    if(err){
      res.send('shit an error happened')
    } else {
      res.redirect('/users/'+userid)
    }
  })
})

router.post('/unfollow/:userid', function(req,res){
  var userid = req.params.userid; 
  req.user.unfollow(userid, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/users/' + userid)
    }
  })
})

// following: ?? , followers: ??

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;