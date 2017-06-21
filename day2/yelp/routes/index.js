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
  apiKey: 'AIzaSyABwIe8NmwWnXt0DjRDKl-mUBjR6l8JiNE',
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

router.get('/', function(req, res){
  if(!req.user) {
    console.log('err');
  } else {
    res.render('singleProfile', {
      user: req.user
    })

  }
})

router.get('/profiles', function(req, res) {
  User.find()
      .exec(function(err, allUsers){
        res.render('profiles', {
          users: allUsers
        })
      })
  // User.findById(req.params.user_id, function(err, user) {
  //       res.render('profiles', {
  //         user: req.user
  //       })
  // })
})

router.get('/users/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, currentUser) {
    currentUser.getFollows(req.params.user_id, function(followers, followings) {
      currentUser.isFollowing(req.user, function(bool) {
        console.log(bool)
        console.log('followers are', followers, 'following is', followings)
        res.render('singleProfile', {
          user: currentUser,
          allFollowers: followers,
          allFollowings: followings,
          isFollowing: bool
        })
      })
    })
  })
});

router.post('/follow/:user_id', function(req, res){
  req.user.follow(req.params.user_id, function(err, usr){
    res.redirect('/profiles')
  })
});
//   User.follow(req.params.user_id, function(err, user){
//     if(err){
//       res.send(err);
//     } else {
//       res.redirect('/profiles');
//     }
//   })
// });

router.post('/unfollow/:user_id', function(req, res){
  //req.user --> current user
  req.user.unfollow(req.params.user_id, function(err, usr){
    res.redirect('/profiles')
  })
});
//   User.unfollow(req.params.user_id, function(err, user){
//     if(err){
//       res.send(err);
//     } else {
//       res.redirect('/profiles');
//     }
//   })
// });

router.get('/restaurants/new', function(req,res) {
  res.render('newRestaurant');
})

router.get('/allrestaurants', function(req, res){
  Restaurant.find()
            .exec(function(err, all){
              res.render('restaurants',{
                restaurants: all
              })
            })
})
router.get('/restaurants/:id', function(req, res){
  Restaurant.findById(req.params.id)
            .exec(function(err, foundRestaurant){
              res.render('singleRestaurant',{
                restaurant: foundRestaurant,
              })
            })
})
router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
    // console.log(typeof data[0].latitude)
    var restaurants = new Restaurant({
      name: req.body.name,
      category:  req.body.category,
      latitude:  req.body.latitude,
      longitude:  req.body.longitude,
      price:  req.body.price,
      openTime:  req.body.openTime,
      closeTime:  req.body.closeTime
    });
    restaurants.save(function(err){
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully save restaurant");
        res.redirect('/allrestaurants');
      }
    })
  })



});

module.exports = router;
