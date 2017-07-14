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

  User.find({}, function(err, users) {
    // res.json(users);
    var user1 = users[0];
    var user2 = users[1];

    user2.getFollows(function(followings, followers) {
      res.json({
        '1': followings,
        '2': followers
      });
    })
  })
})
  // Follow.find({}, function(err, follows) {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json(follows);
  //   }


  var myCallback = function(err) {
    if (err) {
      res.json(err);
    } else {
      res.json('success');
    }
  }

  user1.follow(user2._id, myCallback)

})
//
//
//
//   var user = new User({
//     email: 'dmmy@gmail.com',
//     password: "dummy2"
//   })
//
//   user.save(function(err) {
//     res.send('i have overidden the middleware')
//   })
// })

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
