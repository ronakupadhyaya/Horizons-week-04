var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});
router.get('/', function(req, res){
  req.user.getFollows(function(response){
    var allFollowers = response.followed;
    var allFollowing = response.follows;
    var newFollowObj = {}
    allFollowers.map(function(element, index, array){
      return {
        from: element,
        to: req.user
      }
    });

    allFollowing.map(function(element, index, array){
      return {
        from: req.user,
        to: element
      }
    });
    console.log(allFollowers, allFollowing);
    res.render('singleProfile', {user: req.user, followers: allFollowers, followings: allFollowing});
  })

})
router.get('/users/', function(req, res, next) {

  // Gets all users
  User.find(function(err, users){
    res.render('profiles', {users: users, userLength: users.length})
  })
});

router.get('/users/:userId', function(req, res, next) {

  // Gets all information about a single user

  User.findById(req.params.userId, function(err, user){
    if(err){
      res.send(err);
    } else{
      req.user.isFollowing(user, function(err, respObj){
        if(err){
          res.send(err);
        } else{
          user.getFollows(function(response){
            var allFollowers = response.followed;
            var allFollowing = response.follows;
            allFollowers.map(function(element, index, array){
              return {
                from: element,
                to: user
              }
            });

            allFollowing.map(function(element, index, array){
              return {
                from: user,
                to: element
              }
            });
            console.log("following", allFollowing);
            res.render('singleProfile', {user: user, followers: allFollowers, followings: allFollowing, isFollowing: respObj.isFollowing});
          })
        }


      })

    }
  })

});

router.get('/followers', function(req, res){
  var userId = req.user.id;
  User.findById(userId, function(err, user){
    user.getFollows(function(resultObj){
      console.log("RESULT OBJ", resultObj);
      res.json(resultObj);
    })
  })
});

router.get('/follow/:userId', function(req, res){
  var idToFollow = req.params.userId;
  User.findById(req.user._id, function(err, user){
    user.follow(idToFollow, function(err, followObj){
      console.log("FOLLOW OBJ", followObj);
      res.send(followObj);
    })
  });
});

router.get('/unfollow/:userId', function(req, res){
  var idToFollow = req.params.userId;
  User.findById(req.user._id, function(err, user){
    user.unfollow(idToFollow, function(err, followObj){
      console.log("FOLLOW OBJ", followObj);
      res.json(followObj);
    })
  });
})

router.get('/tweets/', function(req, res, next) {

  // Displays all tweets in the DB

});

router.get('/tweets/:tweetId', function(req, res, next) {

  //Get all information about a single tweet

});

router.get('/tweets/:tweetId/likes', function(req, res, next) {

  //Should display all users who like the current tweet

});

router.post('/tweets/:tweetId/likes', function(req, res, next) {

  //Should add the current user to the selected tweets like list (a.k.a like the tweet)

});

router.get('/tweets/new', function(req, res, next) {

  //Display the form to fill out for a new tweet

});

router.post('/tweets/new', function(req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB


});

module.exports = router;
