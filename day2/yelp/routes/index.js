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

router.get('/', function(req,res,next){
  res.redirect('/users');
})

router.get('/users', function(req,res,next){
  var userId = req.params.id;
  User.find().exec(function(err,users){
    if(err){
      res.status(404).send(err);
    }else{
      res.render('profiles', {
        users: users,
        errors: err
      })
    }
  })
})



router.get('/users/:userId', function(req,res,next){
  var userId = req.params.userId;
  var loggedInUser = req.user;
  User.findById(userId, function(error,user){
    if(error){
      res.status(404).send(err);
    }else if(!user){
      // console.log(user);
      res.status(404).send("No user with that id")
    }else{
        user.getFollows(function(error, result) {
          var usersProfile = false;
          if(userId == loggedInUser._id+""){
            usersProfile = true;
            console.log("this is current user",usersProfile);
          }
          var alreadyFollowed;
          if(usersProfile){
            alreadyFollowed = result.allFollowers.find(function(follower){
              // console.log("follower",follower.from._id,req.user._id,follower.from._id+"" == req.user._id+"");
              return follower.from._id+"" == req.user._id+"";
            })
          }
          // console.log(alreadyFollowed);

          res.render('singleProfile',{
            user: user,
            allFollowers: result.allFollowers,
            allFollowing: result.allFollowing,
            usersProfile: usersProfile,
            alreadyFollowed: alreadyFollowed
          })
        })
    }
  })
})

// router.get('/users/myprofile'){
//   req.user.getFollows(function(followers, followings) {
//     res.render('singleProfile',{
//       user: req.user,
//       allFollowers: followers,
//       allFollowings: followings
//     })
//   })
// }

router.get('/follow/:userId', function(req,res,next){
  var userId = req.params.userId;
  var loggedInUser = req.user;
  req.user.follow(userId, function(err,result){
    if(err && err.length>0){
      // res.render('/users/:userId', {errors: err})
      res.send(err);
    }else{


      res.redirect('/users/'+userId);

      // res.render('/users/:userId',{
      //   user: req.user,
      //   allFollowers: followers,
      //   allFollowings: followings
      // })
    }
  })

})

router.get('/unfollow/:userId', function(req,res,next){
  var idToUnfollow = req.params.userId;
  req.user.unfollow(userId, function(err,result){
    if(err && err.length>0){
      // res.render('/users/:userId', {errors: err})
      res.send(err);
    }else{
      res.redirect('/users/'+userId);
      // res.render('/users/:userId',{
      //   user: req.user,
      //   allFollowers: followers,
      //   allFollowings: followings
      // })
    }
  })
})

// router.get('/login', )
router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});


module.exports = router;
