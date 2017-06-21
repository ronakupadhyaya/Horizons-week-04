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
  apiKey: 'AIzaSyDSGTTktLxFOzTgYYC3GF_xSFIky0DSAmo',
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
  res.redirect('/users/'+req.user._id);
});

router.get('/users/:userid',function(req,res){
  User.findById(req.params.userid,function(err,userViewed){
    if(!userViewed){res.redirect('/')}
    else {
      userViewed.getFollows(userViewed._id,function(followers,followings){
        // console.log("following", followings);
        userViewed.getReviews(function(reviews){
          res.render('singleProfile',{
            user:userViewed,
            followings:followers,
            followers: followings
          })
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

//an alternative to follow&unfollow

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
  geocoder.geocode(req.body.address, function(err, data) {
    // console.log(data);
    var arr = req.body.address.split(',');
    var newRestaurant = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      openTime: req.body.opentime,
      closeTime: req.body.closetime
    })
    newRestaurant.save();
    // Geocoding - uncomment these lines when the README prompts you to!

    res.redirect('/restaurants');
  });

});

router.get('/restaurants',function(req,res){
  Restaurant.find({},function(err,restaurants){
    res.render('restaurants', {
      restaurants:  restaurants
    });
  })
})

router.get('/restaurants/:restaurantid',function(req,res){
  Restaurant.findById(req.params.restaurantid,function(err,restaurant){
    restaurant.getReviews(function(reviews){
      res.render('singleRestaurant',{
        restaurant:restaurant,
        reviews: reviews
      })
    })
  })
})

router.get('/restaurants/:id/review',function(req,res){
  Restaurant.findById(req.params.id,function(err,restaurant){
    res.render('newReview',{
      restaurant:restaurant
    })
  })
})

router.post('/restaurants/:id/review',function(req,res){
  var r = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantid: req.params.id,
    userid: req.user._id
  })
  console.log('new review is ',r)
  r.save(function(err){
    if(err){console.log("not saved!!!!",err)}
    else {console.log("new review saved")}
  });
  res.send("new review saved");
})


module.exports = router;
