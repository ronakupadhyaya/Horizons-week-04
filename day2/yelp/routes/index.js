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

// THE WALL!!! - any routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

// Redirect the user to their page after they login
router.get('/', function(req, res) {
  res.redirect('/users/' + req.user._id);
})
// Display all of the profiles on one page
router.get('/users', function(req, res) {
  // Get all of the users
  User.find(function(err, users) {
    // if(!users) {res.redirect('/')}
    res.render('profiles', {users: users});
  })
})

// Display a user page
router.get('/users/:userid', function(req, res) {
  // Find the user's page we want to render
  User.findById(req.params.userid, function(err, foundUser) {
    console.log(req.params.userid);
    if(!foundUser) {
      res.redirect('/login');
    } else {
      // Get followers/following for the page we want to display
      foundUser.getFollows(function(followers, following){

        // Render the page with the user info, the user's followers/following
        res.render('singleProfile', {
          user: foundUser,
          allFollowers: followers,
          allFollowing: following
        });
      });
    }
  })
})

router.post('/follow/:userid' , function(req, res) {
      req.user.follow(req.params.userid, function(msg){
        res.send(msg);
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
