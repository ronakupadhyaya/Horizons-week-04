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
  var idToSee = req.params.id;
  User.findById(idToSee, function(err, user){
    if(user) {
      console.log(user);
      user.getFollows(function(followers, following){
        console.log('Followers: ', followers , 'following:', following);

        res.render('singleProfile.hbs', {
          user: user,
          followings: following,
          followers: followers
        })
      })
    } else{
      res.send('Could not find this user');
    }
  })
})

router.get('/profiles', function(req, res){
  User.find(function(err, users){
    if(err){
      res.send('Error!', err)
    } else{
      console.log(users);
      res.render('profiles', {
        users: users
      });
    }
  })
})

router.get('/restaurants', function(req, res){
  Restaurant.find(function(err, restaurants){
    if(err){
      res.send('Error!', err);
    } else{
      res.render('restaurants',{
        restaurants: restaurants
      })
    }
  })
})

router.get('/restaurants/new', function(req, res){
  res.render('newRestaurant');
})

router.get('/restaurants/:id', function(req, res){
  Restaurant.findById(req.params.id, function(err, restaurant){
    if(err){
      console.log('Error!', err);
    } else{
      res.render('singleRestaurant', {
        restaurant: restaurant
      })
    }
  })
})

router.post('/restaurants/new', function(req, res, next) {

  var newRestaurant = new Restaurant({name: req.body.name, category: req.body.cqtegory, lattitude: 1, longitude: 1, price: req.body.price, openTime: req.body.open, closingTime: req.body.close});
  newRestaurant.save(function(err, rest){
    if(err){
      console.log('Failed to save', err);
    } else{
      res.redirect('/restaurants');
    }
  })
  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
