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

router.get('/users/:id', function(req, res){
  var id = req.params.id;
  var myId = req.user._id;

  // find the profile's user
  User.findById(id, function(err,foundUser){
    if(foundUser){
      // find the session's user
      User.findById(myId, function(err, myUser){
        if(myUser){
          // get followers and leaders
          foundUser.getFollows(function(foundFollowers, foundLeaders){
            console.log("foundFollowers", foundFollowers);
            // check if session user is following profile user
            myUser.isFollowing(foundUser, function(success){
                // TODO get the reviews from this user
                foundUser.getReviews(function(foundReviews){
                  res.render('singleProfile', {
                    user: foundUser,
                    followers: foundFollowers,
                    following: foundLeaders,
                    alreadyFollowed: success,
                    reviews: foundReviews
                  });
                })
            });
          });
        }else{
          console.log("could not find session user document");
        }
      });
    }else{
      res.status(400).send("Invalid user id, nice try brah");
    }
  });
});

router.post('/follow/:userid', function(req, res){
  var userToFollowId = req.params.userid;
  var sessionUser = req.user;

  if(!sessionUser){
    res.setStatus(400);
    console.log("unauthorized");
    return;
  }

  sessionUser.follow(userToFollowId, function(err){
    if(err){
      res.setStatus(500);
      return;
    }else{

      res.redirect('/users/' + userToFollowId);
    }
  });

});

router.post('/unfollow/:userid', function(req, res){
  var userToUnfollowId = req.params.userid;
  var sessionUser = req.user;
  if(!sessionUser){
    res.setStatus(400);
    console.log("unauthorized");
    return;
  }
  sessionUser.unfollow(userToUnfollowId, function(err){
    if(err){
      res.setStatus(500);
      return;
    }else{
      res.redirect('/users/' + userToUnfollowId);
    }
  });
});



router.get('/users', function(req, res){
  User.find({}, function(err, foundAllUsers){
    if(err){
      res.status(500).send("database errorrrrrrrr :( :( :(");
      return;
    }
    res.render('profiles', {
      currUser: req.user.displayName,
      user: foundAllUsers
    });
  });
});

router.get('/', function(req, res){
  res.redirect('/users/');
})

router.get('/restaurants/new', function(req,res){
  res.render('newRestaurant', {
    category: Restaurant.schema.path('category').enumValues
  })
})



// router.post('/newRestaurant', function(req, res){
//   // var restaurant = new Restaurant({
//   //   name: req.body.name,
//   //   category: req.body.category,
//   //   latitude: 120, //temp
//   //   longitude: 120, //temp
//   //   price: req.body.price,
//   //   openTime: req.body.openTime,
//   //   closeTime: req.body.closeTime,
//   //   reviewCount: 0,
//   //   totalScore: 0
//   // })
//
//   $.ajax({
//     url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(req.body.address),
//     method: "get",
//     success: function(data){
//       var latitude = data.results[0].geometry.location.lat;
//       var longitude = data.results[0].geometry.location.lng;
//
//       var restaurant = new Restaurant({
//         name: req.body.name,
//         category: req.body.category,
//         latitude: latitude,
//         longitude: longitude,
//         price: req.body.price,
//         openTime: req.body.openTime,
//         closeTime: req.body.closeTime,
//         reviewCount: 0,
//         totalScore: 0
//       });
//
//       restaurant.save(function(err, newRestaurant){
//         if(err){
//           res.send("Error in saving restaurant");
//         }else{
//           res.redirect('/restaurants/' + newRestaurant._id);
//         }
//       });
//
//     }
//   })
// })



router.get('/restaurants/:rid', function(req, res){
  var rid = req.params.rid;
  Restaurant.findById(rid, function(err, foundRestaurant){
    if(err){
      res.send("Error in finding restaurants")
    }else if(foundRestaurant){
      foundRestaurant.getReviews(function(foundReviews){
        res.render('singleRestaurant', {
          restaurant: foundRestaurant,
          reviews: foundReviews
        })
      });
    }else{
      res.send("Restaurant not found");
    }
  });

})

router.get('/restaurants', function(req, res){
  Restaurant.find(function(err, foundRestaurants){
    if(err){
      res.send("Error in finding restaurants")
    }else if(foundRestaurants){
      res.render('restaurants', {
        restaurant: foundRestaurants
      })
    }else{
      res.send("Restaurants not found");
    }
  })
});

router.post('/restaurants/new', function(req, res, next) {

  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    latitude: 48,
    longitude: 48,
    price: req.body.price,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
    reviewCount: 0,
    totalScore: 0
  });

  restaurant.save(function(err, newRestaurant){
    if(err){
      res.send("Error in saving restaurant");
    }else{
      res.redirect('/restaurants/' + newRestaurant._id);
    }
  });

});

router.get('/restaurants/:id/review', function(req, res){
  res.render('newReview');
})

router.post('/restaurants/:id/review', function(req, res){
  var rid = req.params.id;
  var uid = req.user._id;

  var newReview = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurant: rid,
    user: uid
  });

  newReview.save(function(err, savedReview){
    if(err){
      res.status(400).send("Error in saving review")
    }else{
      // update the restaurant
      Restaurant.findById(rid, function(err, foundRestaurant){
        console.log("restaurant is", foundRestaurant);
        console.log("review is", savedReview);
        if(err){
            res.status(400).send("Error in finding restaurant");
        }else{
          if(foundRestaurant){
            foundRestaurant.reviewCount++;
            foundRestaurant.totalScore += savedReview.stars;
            foundRestaurant.save(function(err, savedRestaurant){
              if(err){
                res.status(500).send("database error");
              }else{
                res.redirect('/restaurants/' + rid);
              }
            });
          }
        }
      })
    }
  })
})


module.exports = router;
