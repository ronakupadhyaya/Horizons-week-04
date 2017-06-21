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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCsyhrX4nc3NUIK433lh9fE1U0Z2i7xHSg",
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

router.get('/',function(req,res){
 User.find(function(err,users){
  res.render('profiles',{
    users:users})
  })
})

router.get('/user/:userId', function(req,res){
  var userId=  req.params.userId;
  User.findById(userId,function(err,user){
    if(err || !user){
      res.status(404).send("No user")
    }else{
      user.getFollows(userId,function(err,result){
        var allFollowing = result.allFollowing;
        var allFollowers = result.allFollowers;
        res.render('singleProfile',{user: user, following: allFollowing, followers: allFollowers})
      })
    }
  })
})

router.post('/follow/:userId',function(req,res){
  var userId= req.params.userId;

  User.findById(req.user._id,function(err,user){
    if(err){
      res.send("user not found")
    }else {
      user.follow(userId,function(){
        res.redirect('/')

      })
    }
  })
})

router.post('/unfollow/:userId',function(req,res){
  var userId= req.params.userId;

  User.findById(req.user._id,function(err,user){
    if(err){
      res.send("user not found")
    }else {
      user.unfollow(userId,function(){
        console.log('successfully unfollowed')
        res.redirect('/')
      })
    }
  })
})

router.get('/restaurants/new', function (req,res){
  res.render('newRestaurant')
})

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {

    var restaurant= new Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      opentime: req.body.opentime,
      closetime: req.body.closetime,
      totalScore: 0,
      reviewCount: 0
    })

    restaurant.save(function(err,restaurant){
        if(err){
          console.log(err);
          res.status(500)
          return;
        } else{
          res.redirect('/restaurants')
        }
      })
  });
});

router.get('/restaurants',function(req,res){
  Restaurant.find(function(err,restaurant){
    res.render('restaurants',{
      restaurant: restaurant
    })
  })
})

router.get('/restaurants/:restaurant_id',function(req,res){
  var restaurant_id = req.params.restaurant_id;

  Restaurant.findById(restaurant_id, function(err,restaurant){
    restaurant.getReviews(restaurant_id,function(err,reviews){
      if(err){
        res.send(err)
      } else{
        console.log(restaurant)
        
        res.render('singleRestaurant',{
          restaurant: restaurant,
          reviews: reviews
        })

      }
    })
  })
})

router.get('/reviews/:restaurant_id/new', function (req,res){
  res.render('newReview', {
    restaurant_id: req.params.restaurant_id
  })
})

router.post('/reviews/:restaurant_id/new',function(req,res){
  var review = new Review({
    stars: req.body.stars,
    content: req.body.content,
    restaurant: req.params.restaurant_id,
    user: req.user._id
  })
  console.log(review)
  review.save(function(err,review){
      if(err){
        console.log(err);
        res.status(500)
        return;
      } else{
        Restaurant.findById(req.params.restaurant_id,function(err,restaurant){
            restaurant.reviewCount += 1;
            restaurant.totalScore += req.body.stars;
            restaurant.save(function(err){
              res.redirect('/restaurants/' +req.params.restaurant_id)
            })
        })
      }
    })
})

module.exports = router;
