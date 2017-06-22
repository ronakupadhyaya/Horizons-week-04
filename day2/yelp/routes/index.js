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
  apiKey: process.env.GEOCODING_API_KEY || 'AIzaSyD3_82ErGRq5XN0Noi4k8aUL6EvSkvu_0c',
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

router.get('/', function(req,res){
  res.redirect('/restaurants');
})

router.get('/users/:userid', function(req,res){
  var id = req.params.userid;

  User.findById(id, function(err, found){
    found.getFollows(function(followers, following) {
      //console.log(followers, following)

      //Review.find({rid: req.params.rest_id}, function(err, reviews){
      Review.find({uid: req.params.userid}, function(err, reviews){
        res.render('singleProfile',{
          user: found,
          reviews: reviews,         //array of reviews of this user
          allFollowers: followers,
          allFollowing: following
          // isFollowing:
        });
      })

    });
  })

})

router.get('/users', function(req, res){
  var id = req.user._id;

  Follow.find({from: req.user._id}).exec(function(err, followings) {
    //console.log(followings);
    var myfollowings = [];
    followings.forEach(function(i) {
      myfollowings.push("" + i.to);
    })
    //console.log(myfollowings);
    User.find({}).exec(function(err, users){
      users = JSON.parse(JSON.stringify(users));
      users = users.map(function(i) {
        //console.log(i);
        i['isFollowing'] = myfollowings.indexOf(i._id) > -1 ? true : false;
        return i;
      })
      res.render('profiles', { users: users})

    })

  })

})

//ROUTE TO HANDLE A USER FOLLOWING OR UNFOLLOWING ANOTHER
router.get('/users/:userid/follow', function(req,res){

  User.findById(req.user._id, function(err, user){
    user.follow(req.params.userid, function(err, followed){
      if(err){
        //console.log(err);
        res.send({err: err})
      }else{
        res.redirect('/users');
      }
    })
  })

})

router.get('/users/:userid/unfollow', function(req,res){

  User.findById(req.user._id, function(err, user){
    user.unfollow(req.params.userid, function(err, user){
      if(err){
        res.send({err: err})
      }else{
        res.redirect('/users');
      }
    })
  })




})

router.get('/restaurants/new', function(req,res){
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {

//NEED TO UPDATE TO GET ACUTAL LAT AND LONG OUT OF ADDRESS

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    // console.log(err);
    // console.log(data[0]);

    var restaurant = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      open: req.body.open,
      close: req.body.close
    })

    restaurant.save(function(err){
      if(err){
        res.send({err: err})
      }else{
        res.redirect('/restaurants');
      }
    })
  });

});

router.get('/restaurants', function(req, res){

  Restaurant.find(function(err, rests){
    //console.log(rests)
    res.render('restaurants', {
      restaurant: rests
    });
  })

})

router.get('/restaurants/:rest_id', function(req, res){
  Restaurant.findById(req.params.rest_id, function(err, found){
    if(err){
      res.send({err: err})
    }else{
      //console.log(found)

      Review.find({rid: req.params.rest_id}, function(err, reviews){

        var rest_info = {
          name: found.name,
          price: found.price,
          latitude: found.latitude,
          longitude: found.longitude,
          open: found.open,
          close: found.close,
          id: req.params.rest_id,
          key: 'AIzaSyD3_82ErGRq5XN0Noi4k8aUL6EvSkvu_0c',
          reviews: reviews//array of reviews with this rid
        }
        res.render('singleRestaurant', rest_info)

      })

    }
  })


})

router.get('/restaurants/:rest_id/new', function(req,res){
  Restaurant.findById(req.params.rest_id, function(err, found){
    if(err){
      res.send({err: err})
    }else{
      console.log('HERE')
      res.render('newReview', {name: found.name, id: req.params.rest_id});
    }
  })
})


router.post('/restaurants/:rest_id/new', function(req,res){
  var new_review = new Review({
    content: req.body.review,
    stars: req.body.rating,
    rid: req.params.rest_id,
    uid: req.user._id
  })

  new_review.save(function(err){
    if(err){
      res.send({err: err})
    }else{
      res.redirect(`/restaurants/${req.params.rest_id}`)
    }
  })
})




module.exports = router;
