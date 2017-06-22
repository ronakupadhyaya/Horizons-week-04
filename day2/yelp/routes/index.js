var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

var expressValidator = require('express-validator');
router.use(expressValidator());
// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyByS4EgixgDAkOJHvwBa4VmyHQo6fYrvrE",
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

router.get('/', function(req,res,next){
  // res.render
  // res.render('home');
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
      res.status(404).send("No user with that id")
    }else{
        user.getFollows(function(error, result) {
          var usersProfile = false;
          if(userId == loggedInUser._id+""){
            usersProfile = true;
          }

          var alreadyFollowed = result.allFollowers.find(function(follower){
              // console.log("follower",follower.from._id,req.user._id,follower.from._id+"" == req.user._id+"");
              return follower.from._id+"" == req.user._id+"";
            })
          user.getReviews(function(error,reviews){
            if(error){
              console.log("errors getting reviews");
            }else{


              // console.log(result.allFollowing);
              res.render('singleProfile',{
                user: user,
                allFollowers: result.allFollowers,
                allFollowing: result.allFollowing,
                usersProfile: usersProfile,
                alreadyFollowed: alreadyFollowed,
                reviews: reviews
              })
            }
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

router.get('/users/:userId/follow', function(req,res,next){
  var userId = req.params.userId;
  var loggedInUser = req.user;
  req.user.follow(userId, function(err,result){
    if(err && err.length>0){
      // res.render('/users/:userId', {errors: err})
      res.send(err);
    }else{

      res.redirect('/users/'+userId);

    }
  })

})

router.post('/users/:userId/unfollow', function(req,res,next){
  console.log("entered unfollow");
  // var userId = req.params.userId;
  var idToUnfollow = req.params.userId;
  req.user.unfollow(idToUnfollow, function(err,result){
    if(err && err.length>0){
      // res.render('/users/:userId', {errors: err})
      res.send(err);
    }else{
      res.redirect('/users/'+idToUnfollow);
    }
  })
})


//RESTAURANTS ROUTES

router.get('/restaurants', function(req,res,next){
  Restaurant.find().exec(function(err,restaurants){
    if(err){
      res.send(err);
    } else{
      res.render('restaurants', {
        restaurants: restaurants
      })
    }
  })
})


router.get('/restaurants/new', function(req,res,next){
  console.log("get resturant new");
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {
  req.checkBody('name', 'Please enter a restaurant name').notEmpty();
  req.checkBody('open','please enter a valid opening time').notEmpty();
  req.checkBody('close','please enter a valid closing time').notEmpty();
  req.checkBody('address1','Please enter an address').notEmpty();
  req.checkBody('city','Please enter a city').notEmpty();
  req.checkBody('state','Please enter a state').notEmpty();
  req.checkBody('zip','Please enter a valid zip').isInt().notEmpty();
  req.checkBody('id_prange','Please select a price range').notEmpty();
  req.checkBody('category','Please choose a category').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.render('newRestaurant', {
      errors: errors
    })
  }else{
    var address = req.body.address1+" "+req.body.city+", "+req.body.state+" "+req.body.zip;
    console.log(address);
    geocoder.geocode(address, function(err, data) {
      // if(err && err.length>0){
      //   console.log("error in post restaurants new ");
      //   res.send(err);
      // }else{
      console.log(err,data);
      if(data.length>0){
        var rest = new Restaurant({
          name:req.body.name,
          address: address,
          category:req.body.category,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          price: req.body.id_prange,
          openTime: req.body.open,
          closeTime: req.body.close
        })
        rest.save(function(err, user) {
          if (err) {
            res.send(err);
          }else{
            res.render('singleRestaurant', {
              restaurant: rest,
              dollars: "$".repeat(rest.price)
            })
          }
        })
      }else{
        console.log("no data returned from geocode");
        res.send("couldnt get data from geocode")
      }

    });

  }
});



// router.get('/login', )
router.get('/restaurants/:id', function(req,res,next){
  console.log(req.params.id);
  if(req.params.id == "new"){
    console.log("rerouting to new from id");
    next()
  }else{
    Restaurant.findById(req.params.id, function(err,restaurant){
      if(err){
        res.send(err);
      } else{
        // console.log(restaurant);
        restaurant.getReviews(function(error,result){
          if(error){
            console.log("errors getting reviews");
          }else{
            // console.log(result);
            // var starclass= restaurant.averageRating+"";
            console.log("restaurant average rating inside get", restaurant.averageRating);
            res.render('singleRestaurant', {
              restaurant: restaurant,
              dollars: "$".repeat(restaurant.price),
              reviews: result

            })
          }
        })
      }
    })
  }
})


router.get('/restaurants/:id/review', function(req,res,next){
  var restid = req.params.id;
  if(restid){
    res.render('newReview');
  }
})

router.post('/restaurants/:id/review', function(req,res,next){
  var restid = req.params.id;
  var content = req.body.content;
  var rating = req.body.rating;
  var userId = req.user._id;

  // console.log(restid,content,rating,userId);
  // console.log("not aprsefloat", rating, "parsefloat raing", parseFloat(rating));
  var review = new Review({content: content, stars: rating, userId: userId, restaurantId: restid});
  review.save(function(err,result){
    if (err) {
      console.log("error saving review");
      res.send(err);
    }else{
      Restaurant.findById(restid, function(err, rest) {
            
            var ratingFloat = parseFloat(rating);
            // console.log("rating type after parsefloat", typeof parseFloat(ratingFloat.toFixed(1)));
            rest.totalScore += parseFloat(ratingFloat.toFixed(1));
            console.log("rest total score",rest.totalScore);
            rest.reviewCount += 1;
            rest.save(function(err,val){
              res.redirect('/restaurants/'+restid)
            })
      })

      // res.redirect('/restaurants/'+restid);
    }
  })
})



module.exports = router;
