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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCJvW1-oBFitDzp1OnC9yqESkAGCBE7fs0",
  httpAdapter: "https",
  formatter: null
});

// AIzaSyCJvW1-oBFitDzp1OnC9yqESkAGCBE7fs0    API key

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
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
  });

});

router.get('/',function(req,res){
  res.send('Home Page');
})

router.post('/follow/:userId',function(req,res){
    req.user.follow(req.params.userId,function(err,result){
      console.log("saved",result)
      res.redirect('/user/'+req.params.userId);
    })
  });

router.get('/user/:userId',function(req,res){
  var thisId = req.params.userId;
  User.findById(thisId, function(err,result){
    console.log("user",result)
    if(err || !result){
      res.status(404).send("No User found")
    } else {
      result.getFollows(function(err,allFollowers,allFollowing){
        console.log("allFollowers",allFollowers)
        if(err){
          res.status(404).send("No follow info found")
        } else {
          res.render('singleProfile',{
            user:result,
            following:allFollowing,
            followers:allFollowers
          });
        }
      })

    }
  })
})

router.get('/users',function(req,res){
  var list ;
   User.find(function(err,result){
     if(err){
       console.log("err!");
     } else {
       list = result;
       res.render('profiles',{users:list})
     }
   });
})

module.exports = router;
