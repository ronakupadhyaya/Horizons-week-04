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

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});
router.get('/', function(req,res){
  if(req.user){
    req.user.getReviews(function(reviews){
      req.user.getFollows(function(followers,follows){
        console.log("followers",followers);
        console.log(follows);
        res.render('singleProfile',{
          user:req.user,
          reviews:reviews,
          follows:follows,
          followers:followers
        })
      })
    })

  }else{
    res.redirect('/login')
  }
})

router.get('/users', function(req,res){
  User.find(function(err,users){
    res.render('profiles',{
      users:users
    })
  })
})

router.get('/restaurants/new', function(req,res){
  res.render('newRestaurant');
})

router.post('/restaurant/new', function(req,res){
  var restObject = new Restaurant({
    name:req.body.restaurantName,
    price: req.body.price,
    category: req.body.category,
    openTime: req.body.openTime.substring(0,2),
    closingTime: req.body.closingTime.substring(0,2),
  })
  restObject.save(function(err,suc){
    if(err){
      console.log(err);
    }else{res.render('singleRestaurant',{
      restaurant: restObject
    })
  }
})
})

router.get('/restaurants', function(req,res){
  Restaurant.find(function(err, restaurants){
    if(err){
      console.log(err);
    }else{
      res.render('restaurants',{
        restaurants:restaurants
      })
    }
  })
})
router.get('/restaurants/:id', function(req, res){
  Restaurant.findById(req.params.id,function(err, restaurant){
    if(err){
      console.log(err);
    }else{
      var reviews = restaurant.getReviews(function(reviews){
        res.render('singleRestaurant',{
          restaurant:restaurant,
          reviews:reviews
        })
      })

    }
  })
})
router.post('/restaurants/:id/review', function(req,res){
  var reviewObj = new Review({
    stars:req.body.stars,
    content:req.body.content,
    restaurant:req.params.id,
    user:req.user._id
  });
  reviewObj.save(function(err, suc){
    if(err){
      console.log(err);
    }else{
      res.redirect('/restaurants/'+req.params.id)
    }
  })
})
//Route to get a single profile
// router.get('/users/:userId', function(req,res){
//   var userId = req.params.userId;
//
// })

module.exports = router;
