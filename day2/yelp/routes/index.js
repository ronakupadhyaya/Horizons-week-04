var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Reviews = models.Reviews;

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
     next();
  }
});

router.get('/users/:id',function(req,res){
  var id=req.params.id;
  User.findById(id,function(err,user){
    user.getFollows(id,function(err,allFollowing,allFollowers){
      user.getReviews(id,function(reviews){
        console.log("THIS",reviews);
        res.render('singleProfile',{
          user:user,
          following:allFollowing,
          followers:allFollowers,
          reviews:reviews
        })
      })

    })
  })

})

router.get('/restaurants',function(req,res){
  Restaurant.find(function(err,places){
    //var user=req.user;
    res.render('restaurants',{
      restaurants:places,
      name:req.user.displayName
    })
  })
})

router.get('/restaurants/new',function(req,res) {
  res.render('newRestaurant');
})

router.get('/restaurants/:id',function(req,res){
  console.log("HERE");
  var id=req.params.id;
  Restaurant.findById(id,function(err,place){
    place.getReviews(id,function(reviews){
      res.render('singleRestaurant',{
        restaurant:place,
        reviews:reviews
      })
    })
  })
})

router.post('/restaurants/new', function(req, res, next) {
  var newRestaurant = new Restaurant({
    name:req.body.name,
    category:req.body.category,
    latitude:req.body.latitude,
    longitude:req.body.longitude,
    price:req.body.price,
    openTime:req.body.openTime,
    closingTime:req.body.closingTime
  });
  newRestaurant.save(function(err,saved) {
    if (err) {console.log(err);return}
    res.redirect('/restaurants')
  })
});

router.get('/newreview/:resId',function(req,res){
  res.render('newReview',{
    resId:req.params.resId
  });
})

router.post('/newreview/:resId',function(req,res){
  var newReview=new Reviews({
    content:req.body.content,
    stars:req.body.stars,
    resId:req.params.resId,
    userId:req.user._id
  })
  newReview.save(function(place){
    res.redirect('/restaurants')
  })
})

router.get('/follow/:userId',function(req,res){
  var to=req.params.userId;
  var from=req.user;
  from.follow(to,function(err,success){
    if(err)console.log(err);
    else{
      res.redirect('/restaurants');
    }
  })
})

router.get('/logout',function(req,res){
  req.logout();
})

module.exports = router;
