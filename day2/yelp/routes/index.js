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

//Home Page
router.get('/',function(req,res){
  if(req.user){
    res.render('home',{
      displayName: req.user.displayName
    })
  }
  else{
    res.redirect('/login');
  }
})

//All profiles on site
router.get('/users',function(req,res){
  if(req.query.followID){
    if(req.user){
      var flag = req.query.followStatus;
      if(flag==="true"){
        req.user.follow(req.query.followID,function(){

        })
      }
      else{
        req.user.unfollow(req.query.followID,function(){

        })
      }
    }
  }
  if(req.user){
    User.find().exec(function(err,users){
      var usersArr = [];
      users.forEach(function(item){
        req.user.isFollowing(item._id,function(flag){
          if(flag){
            var u = {
            displayName: item.displayName,
            _id: item._id,
            location: item.location,
            following: true
            }
            usersArr.push(u)
          }
          else{
            var u = {
              displayName: item.displayName,
              _id: item._id,
              location: item.location,
              following: false
              }
            usersArr.push(u)
          }
          if(usersArr.length === users.length){
            res.render('profiles',{
              profileArr: usersArr
            })
          }
        })
      });
      // for(var i =0; i<users.length; i++){
      //   console.log(users[i]);
      //   req.user.isFollowing(users[i]._id,function(flag){
      //     if(flag){users[i].following = true;}
      //     else{users[i].following = false;}
      //   })
      // }

    })
  }
})


//Single Profile Page
router.get('/users/:userID',function(req,res){
  req.user.getFollows(req.params.userID,function(allfollowers, allfollowing){
    // console.log(allfollowers);
    // console.log(allfollowing);
    res.render('singleProfile',{
      user: req.user,
      following: allfollowing,
      followers: allfollowers
    })
  })
})

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

module.exports = router;
