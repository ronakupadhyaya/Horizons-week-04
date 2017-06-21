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

router.get('/', function(req, res, next) {
    // res.render('singleProfile', {
    //   user:
    // });
    User.findById(req.user.id, function(err, user) {
      console.log("USER",user);
      if (err) {console.log(err)} else {
        if (user) {
          user.getFollows(user.id, function(err, followers, following) {
            console.log("USERID:", user.id);
            console.log("FOLLOWERS", followers)
            console.log("FOLLOWING", following)
            if (err) {console.log(err)} else {
              res.render('singleProfile', {
                user: user,
                following: following,
                followers: followers
              });
            }
          })
        }
      }
    })
  });

router.get('/users/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {console.log(err)} else {
      if (user) {
        user.getFollows(user.id, function(err, followers, following) {
          if (err) {console.log(err)} else {
            res.render('singleProfile', {
              user: user,
              following: following,
              followers: followers
            });
          }
        })
      }
    }
  })
});

router.get('/profiles', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users
    });
  })
})
// router.post('/follow/:id', function(req, res, next) {
//   User.follow(req.user.id, req.params.id, function(err) {
//     if (err) return next(err);
//     res.redirect('/profile');
//     // TODO: Confirm following
//   });
// });

// router.get('/follow/:id', function(req,res) {
//   User.findById(req.user.id, function(err, user) {
//     console.log("CURR USR", user);
//     user.follow(req.params.id, function(err) {
//       user.getFollows(user.id, function(err, followers, following) {
//         console.log("fol", followers, following);
//         if (err) {console.log(err)} else {
//           res.render('singleProfile', {
//             user: user,
//             following: following,
//             followers: followers
//           });
//         }
//       })
//       console.log("IDPARAMS", req.params.id)
//       if (err) {console.log(err)} else {
//         //res.render('/')
//       }
//     })
//   })
// })
router.post('/follow/:id', function(req, res) {
  var userToFollow = req.params.id;
  var currentUserId = req.user._id;
  console.log("toFol:", userToFollow, "cur:", currentUserId);
  Follow.findOne({'to': userToFollow, 'from': currentUserId}, function(err, found) {
    if (err) {console.log(err)} else {
      if (found) {
        console.log("Already following");
      } else {
        var newFollow = new Follow({
          from: currentUserId,
          to: userToFollow
        })
        newFollow.save(function(err) {
          if (err) {console.log(err)} else {
            console.log("Follow successful");
          }
        })
      }
    }
    res.redirect('/users/'+userToFollow)
  })
})

router.post('unfollow/:id', function(req, res) {
  var userToUnfollow = req.params.id;
  var currentUserId = req.user._id;
  req.user.unfollow(userToUnfollow, function(err) {
    if (err) {console.log(err)} else {
      console.log("Successful unfollow!");
    }
  })
  res.redirect('/users/'+userToFollow);
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
