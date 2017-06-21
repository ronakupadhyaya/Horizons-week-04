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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyByS4EgixgDAkOJHvwBa4VmyHQo6fYrvrE",
  httpAdapter: "https",
  formatter: null
});


router.get('/',function(req,res,next){
  res.render('layout');
})
router.get('/profile',function(req,res,next){
  User.find(function(err,users){
    //console.log(users);
    res.render('profiles',{
      users:users
    })
  })
})
router.get('/profile/:id',function(req,res,next){
  var follow;
  var self;
  if (req.params.id === req.user.id){
    self = true;
  }
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    user.getFollowers(user.id, function(err, followers, following) {
      if (err) return next(err);
      Follow.find({userFrom:req.user.id, userTo: user._id}, function(err, follows) {
        if (err){
          callback(err);
        }else if (follows.length<=0){
          follow = false;
        }else{
          follow=true;
        }
        res.render('singleProfile', {
          user: user,
          following: following,
          followers: followers,
          follow: follow,
          self:self
        });
      });
    });
  });
})
router.post('/profile/:id/follow',function(req,res,next){
    User.findById(req.user.id, function(err, user) {
      user.follow(req.params.id, function(err){
        if (err){
          res.status(404).send(err);
        }else{
          console.log('success');
          res.redirect('/profile/'+req.params.id)
        }
      })
    })
  })

  router.post('/profile/:id/unfollow',function(req,res,next){
    User.findById(req.user.id, function(err, user) {
      user.unfollow(req.params.id, function(err){
        if (err){
          console.log(err);
        }else{
          res.redirect('/profile/'+req.params.id);
        }
      })
    })
  })


  router.get('/restaurants/new' , function(req,res,next){
    res.render('newRestaurant')
  })

  router.get('/restaurants', function(req,res,next){
    Restaurant.find(function(err,arr){
      if (err){
        res.status(500).redirect('/register');
      }else{
        //console.log(arr);
        res.render('restaurants',{
          restaurants:arr
        })
      }
    })
  })

  router.post('/restaurants', function(req,res,next){
    Restaurant.find(function(err,arr){
      if (err){
        res.status(500).redirect('/register');
      }else{
        //console.log(arr);
        res.render('restaurants',{
          restaurants:arr
        })
      }
    })
  })

  router.get('/restaurants/:id',function(req,res,next){
    Restaurant.findById(req.params.id, function(err, rest) {
      rest.getReviews(function(err, reviews){
        if (err) return next(err);
        var dollars = '$'
        //console.log(rest.averageRating);
        res.render('singleRestaurant', {
          restaurant:rest,
          dollars:dollars.repeat(rest.price),
          review:reviews
        });
      })
    });
  })
  router.post('/restaurants/new', function(req, res, next) {
    req.checkBody('name','You need a first name').notEmpty();
    req.checkBody('prange','You need a range').notEmpty();
    req.checkBody('open','You need an opening time').notEmpty();
    req.checkBody('close','You need a closing time').notEmpty();
    var result = req.validationErrors();
    if (result){

      res.json(result)
    }else if (!result){

      geocoder.geocode(req.body.location, function(err, data) {

        var rest = new Restaurant({
          name:req.body.name,
          category:req.body.category,
          latitude:data[0].latitude,
          longitude: data[0].longitude,
          price:req.body.prange,
          openTime:req.body.open,
          closeTime:req.body.close
        })

        rest.save(function(err, user) {
          if (err) {
            console.log(err);
            res.status(500).redirect('/restaurants/new');
          }else{
            //console.log(user);
            res.redirect('/restaurants')
          }
        })
      })
    }
  });

  router.get('/restaurants/:id/review',function(req,res,next){
    Restaurant.findById(req.params.id, function(err, rest) {
      res.render('newReview',{
        id:req.params.id,
        rest:rest
      });
    })
  })

  router.post('/restaurants/:id/review',function(req,res,next){
    req.checkBody('review','You need a review').notEmpty();
    req.checkBody('star','You need a rating').notEmpty();
    var result = req.validationErrors();
    if (result){
      res.json(result)
    }else if (!result){
      console.log(req.body);
      var review = new Review({
        content:req.body.review,
        stars:req.body.star,
        restId: req.params.id,
        userId: req.user.id
      })
      review.save(function(err){
        if (err){
          res.json(err)
        }else{
          Restaurant.findById(req.params.id, function(err, rest) {
            //console.log("HEEYHEHEU");
            //console.log(rest);
            rest.totalScore += parseInt(req.body.rating);
            rest.reviewCount += 1;
            rest.save(function(err,val){
              res.redirect('/restaurants/'+req.params.id)
            })
          })
        }
      })
    }
  })
// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});





module.exports = router;
