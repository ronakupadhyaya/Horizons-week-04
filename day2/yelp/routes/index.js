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

router.get('/',function(req,res){
  res.redirect('/view/users')
})

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});


router.get('/users/:userId',function(req,res){
    var userId = req.params.userId;

    User.findById(userId, function(err,user){
      if(err || !user){ //could probably break down this down into 404 and 500
        res.status(404).send("No user");
      } else{
        user.getFollows(function(err,result){
          var allFollowing = result.allFollowing;
          var allFollowers = result.allFollowers;

          res.render('singleProfile', {user:user, following: allFollowing, followers: allFollowers})
        })

      }
    })
  })

router.get('/view/users',function(req,res){
  User.find({},function(err,users){
    //console.log(users)
    res.render('profiles',{users:users})
  })
})

router.get("/unfollow/:user_id",function(req,res){
  req.user.unfollow(req.params.user_id,function(err,results){
    if(err){
      console.log("error")
    } else{
      res.redirect('/users/' + req.params.user_id)
    }
  })
})

router.get("/follow/:user_id", function(req,res){

  req.user.follow(req.params.user_id,function(err, results){
    if (err){
      console.log("error")
    }else{
      res.redirect('/users/' + req.params.user_id)
    }
  })

})



router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;