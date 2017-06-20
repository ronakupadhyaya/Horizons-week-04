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

router.get('/',function(req,res){
  res.redirect('/users/'+req.user._id);
});

router.get('/users/:userid',function(req,res){
  User.findById(req.params.userid,function(err,userViewed){
    if(!userViewed){res.redirect('/')}
    else {
      userViewed.getFollows(userViewed._id,function(followers,followings){
        console.log("following", followings);
        res.render('singleProfile',{
          user:userViewed,
          followings:followers,
          followers: followings
        })
      })
    }
  })
});

router.get('/users',function(req,res){
  User.find({},function(err,users){
    if(!users){
      res.json({failure: "no currently registered users!"})
    }else{
      res.render("profile",{users: users});
    }
  })
})

router.get('/users/following/:userid',function(req,res){
  var toId = req.params.userid;
  User.findById(toId,function(err,user){
    if(!user){res.json({failure: "the user you are trying to follow doesn't exist"})}
    else{
      req.user.follow(toId,function(msg){
        res.send(msg);
      })
    }
  })
})

router.get('/users/unfollowing/:userid',function(req,res){
  var toId = req.params.userid;
  req.user.unfollow(toId,function(msg){
    res.send(msg);
  })
})

//an alternative

// router.get('/users/following/:userid',function(req,res){
//   var toId = req.params.userid;
//   var fromId = req.user._id;
//   console.log("toId is ", toId, "fromId is ",fromId)
//   User.findById(toId,function(err,user){
//     if(!user){res.json({failure: "the user you are trying to follow doesn't exist"})}
//     else{
//       Follow.find({to:toId,from:fromId},function(err,follow){
//         // console.log("follow is", follow, "!follow means", !follow)
//         if(follow.length === 0){ //don't use !follow because [] is still truthy
//           var f = new Follow({
//             from: fromId,
//             to: toId
//           })
//           f.save();
//           res.json({success:"followed successfully!"})
//         }
//         else{
//           res.json({failure:"already followed!"})}
//       })
//     }
//   })
// })
//
// router.get('/users/unfollowing/:userid',function(req,res){
//   var toId = req.params.userid;
//   var fromId = req.user._id;
//   User.findById(toId,function(err,user){
//     if(!user){res.json({failure:"the user you unfollow doesn't exist"})}
//     else {
//       Follow.remove({to:toId,from: fromId},function(err,follow){
//         if(follow.length!==0){
//           res.json({success:"unfollowed successfully!"})
//         }
//         else{res.json({failure:"not followed yet!"})}
//       })
//     }
//   })
// })
router.get('/restaurants/new',function(req,res){
  res.render("newRestaurant");
})
router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
