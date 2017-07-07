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

router.get('/test', function(req, res, next) {
  // Save a new User.
  // var user = new User({
  //   email: 'something@gmail.com',
  //   password: 'something'
  // });
  // user.save(function(err) {
  //   if (err) {
  //     res.send('Error occurred while saving user.'+err);
  //   } else {
  //     res.send('User saved.')
  //   }
  // });

  // Find a user.
  User.findOne({email: 'dummy@gmail.com'}, function(err, user) {
    // Follow/unfollow another user.
    // user.follow("595ebfe086a89b4d6c753c11", function(err) {
    //   if (err) {
    //     res.send(err);
    //   } else {
    //     res.send('User followed.');
    //   }
    // });
    // Get Follows of a user..
    // user.getFollows(function(followers, following) {
    //   res.send(followers);
    // });
    // Check if user is following another user
    // user.isFollowing("595ebfe086a89b4d6c753c11", function(response) {
    //   res.send(response);
    // });
  });

});

// router.get('/users/:userid', function(req, res) {
//   var userId = req.params.userid;
//   User.findOne({_id: userId}, function(err, user) {
//     if (err) {
//       res.send('Error occurred while trying to fetch user.')
//     } else if (user === null) {
//       res.send('User does not exist.')
//     } else {
//       user.getFollows(function(followers, following) {
//         res.render('singleProfile', {
//           user: user,
//           followers: followers,
//           followings: following,
//         });
//       });
//     }
//   });
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

module.exports = router;
