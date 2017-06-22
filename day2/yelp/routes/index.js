var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var axios = require('axios')

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

router.get('/users/:userid', function(req, res){
  var id = req.params.userid
  req.user.getFollows(id, function(followers, followings) {
    // console.log(followers);
    // console.log(followings);
    User.findById(id, function(err, userObj){
      if(err) {
        res.status(500).send('error finding user');
      } else {
        userObj.getReviews(function(revArr){
          res.render('singleProfile', {
            allFollowers: followers,
            allFollowings: followings,
            displayName: userObj.displayName,
            email: userObj.email,
            location: userObj.location,
            reviews: revArr,
          })
        })
      }
    })
  })
})

//used to be users
router.get('/', function(req, res){
  User.find({}, function(err, users) {
    if(err){
      res.status(500).send('could not find all users');
    } else {
      res.render('profiles', {users: users});
    }
  })
})

router.get('/restaurants/:restaurantid', function(req,res){
  var id = req.params.restaurantid;
  Restaurant.findById(id, function(err, resObj){
    if(err){
      res.status(500).send('failed to find restaurant');
    } else{
    //   console.log(resObj.latitude);
    // console.log(resObj.longtitude);
    resObj.getReviews(id, function(revArr){
      res.render('singleRestaurant', {restaurant: resObj, reviews: revArr});
    })
    }
  })
})

router.get('/restaurants/:id/review', function(req,res){
  var resId = req.params.id;
  Restaurant.findById(resId, function(err, restObj){
    if(err){
      res.status(500).send('could not get restaurant');
    } else {
      console.log(restObj.name);
      res.render('newReview', {restaurant: restObj});
    }
  })
})

router.post('/restaurants/:id/review', function(req,res){
  var resId = req.params.id;
  var newReview = new Review ({
    content: req.body.review,
    stars: req.body.stars,
    restaurantId: resId,
    userId: req.user._id,
  })
  newReview.save(function(err){
    if(err){
      res.status(500).send('failed to save review');
    } else {
      res.redirect('/restaurants/'+resId);
    }
  })
})

router.get('/newRestaurant', function(req,res){
  res.render('newRestaurant');
})

router.post('/newRestaurant', function(req,res){
  var key = process.env.GOOGLE_API_KEY;
  var latitude;
  var longtitude;
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.address}&key=${key}`)
    .then(function(resp){
      var latitude = resp.data.results[0].geometry.location.lat;
      var longtitude = resp.data.results[0].geometry.location.lng;
      var newRestaurant = new Restaurant({
        name: req.body.name,
        category: req.body.category,
        latitude: latitude,
        longtitude: longtitude,
        price: req.body.price,
        openTime: req.body.openTime,
        closingTime: req.body.closingTime,
        totalScore: 0,
        reviewCount: 0
      })
      newRestaurant.save(function(err){
        if(err){
          res.status(500).send('could not save new restaurant');
        } else {
          res.redirect('/restaurants');
        }
      })
    })
    .catch(function(err){
      console.log('Error: ', err);
    })
});

router.get('/restaurants', function(req,res){
  Restaurant.find({}, function(err, resArray){
    if(err){
      res.status(500).send('could not display restaurants');
    } else{
      res.render('restaurants', {restaurants: resArray});
    }
  })
})

router.post('/api/toggleFollow/:userid', function(req, res){
  req.user.toggleFollow(req.params.userid, function(){res.json({'success': true})})
})

module.exports = router;
