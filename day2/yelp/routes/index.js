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
  apiKey: "AIzaSyCeXK5s9S5p6W-mgw8Mps6ynGNi82q_nk4",
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

router.get('/users/:id', function(req, res) {
    var profileId = req.params.id
    User.findOne({_id: profileId}, function(err, profileUser) {
        if (err) {
            res.status(404).send("Error. User not found.")
            console.log("error"+err);
        }
        else {
            req.user.isFollowing(profileId, function(followBool) {
                profileUser.getFollows(function(followers, following) {
                    var displayName = profileUser.displayName ;
                    var email = profileUser.email;
                    var location = profileUser.location;
                    res.render('singleProfile', {
                        user: {
                            _id: profileId,
                            displayName: displayName,
                            email: email,
                            location: location,
                        },
                        reviews: [],
                        followers: followers,
                        following: following,
                        followBool: followBool
                    })
                })
            })

        }
    })
})

router.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(404).send("Error. No users found.")
        }
        else {
            res.render('profiles', {
                users: users
            })
        }
    })
})


router.get('/', function(req, res) {
    // var longitude;
    // var latitude;
    // geocoder.geocode('Sydney, Australia', function(err, data) {
    //   console.log(err);
    //   addressData = data[0]
    //   latitude = addressData.latitude
    //   longitude = addressData.longitude
    //   console.log(latitude, longitude);
    // })
})

router.post('/follow/:followId', function(req, res) {
    var followId = req.params.followId;
    var userId = req.user._id
    User.findOne({_id: userId}, function(err, user) {
        if (err) {
            res.status(404).send("Error. User not found.")
        }
        else {
            user.follow(followId, function(err) {
                console.log("follow");
                if (err) {
                    console.log("Error!");
                } else {
                    res.redirect('/users/'+followId)
                }
            })
        }
    })
})

router.post('/unfollow/:unfollowId', function(req, res) {
    var unfollowId = req.params.unfollowId;
    var userId = req.user._id
    User.findOne({_id: userId}, function(err, user) {
        if (err) {
            res.status(404).send("Error. User not found.")
        }
        else {
            console.log("unfollow");
            user.unfollow(unfollowId, function(err) {
                if (err) {
                    console.log("Error!");
                } else {
                    res.redirect('/users/'+unfollowId)

                }
            })
        }
    })
})

router.get('/restaurants/new', function(req, res) {
    res.render('newRestaurant')
})

router.get('/restaurants/:restoId', function(req, res) {
    var restoId = req.params.restoId
    Restaurant.findById(restoId, function(err, resto) {
        var restoName = resto.restoName;
        var category = resto.category;
        var price = resto.price;
        var openTime = resto.openTime;
        var latitude = resto.latitude;
        var longitude = resto.longitude
        var closeTime = resto.closeTime;
        res.render('singleRestaurant', {
            restoName: restoName,
            category: category,
            price: price,
            latitude: latitude,
            longitude: longitude,
            openTime: openTime,
            closeTime: closeTime
        })
    })
})

router.get('/restaurants/', function(req, res) {
    var restoId = req.params.restoId
    Restaurant.find(function(err, restos) {
        res.render('restaurants', {
            restos: restos,
            // totalScore: totalScore,
            // reviewCount: reviewCount
        })
    })
})

router.post('/restaurants/new', function(req, res, next) {
    var longitude;
    var latitude;
    geocoder.geocode(req.body.address, function(err, data) {
      addressData = data[0]
      latitude = addressData.latitude
      longitude = addressData.longitude
      var resto = new Restaurant({
          restoName: req.body.restoName,
          category: req.body.category,
          price: req.body.price,
          latitude: latitude,
          longitude: longitude,
          openTime: req.body.openTime,
          closeTime: req.body.closeTime
      })
      resto.save(function(err) {
          if (err) {
              res.status(500).json(err);
          }
          else {
              res.redirect('/restaurants')
          }
      })
    })

});

module.exports = router;
