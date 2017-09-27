var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;
var async = require('async');
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
    req.user.getTweets(function(tweets){
      res.render('singleProfile', {user: req.user, followers: allFollowers, followings: allFollowing, tweets: tweets});
    });

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
            user.getTweets(function(tweets){
              res.render('singleProfile', {user: user, followers: allFollowers, followings: allFollowing, isFollowing: respObj.isFollowing, tweets: tweets});
            })

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
      res.json(resultObj);
    })
  })
});

router.get('/follow/:userId', function(req, res){
  var idToFollow = req.params.userId;
  User.findById(req.user._id, function(err, user){
    user.follow(idToFollow, function(err, followObj){
      res.send(followObj);
    })
  });
});

router.get('/unfollow/:userId', function(req, res){
  var idToFollow = req.params.userId;
  User.findById(req.user._id, function(err, user){
    user.unfollow(idToFollow, function(err, followObj){
      res.json(followObj);
    })
  });
})

router.get('/tweets/', function(req, res, next) {

  Follow.find({follower: req.user.id}, function(err, follows){
    var newTweetArray = [];
    async.each(follows, function(follow, callback){
      Tweet.find({user: follow.following}).populate('user').exec(function(err, tweets){
        async.each(tweets, function(tweet, callback2){
          if(err){
            callback2("ERROR");
          } else{
              newTweetArray.push(tweet);


            callback2();
          }
        }, function(){
          callback();
        })

      })
    }, function(err){
      console.log("newTweetArray", newTweetArray);
      res.render('tweets', {tweets: newTweetArray});
    })
  })


});

router.get('/tweets/new', function(req, res, next) {
  //Display the form to fill out for a new tweet
  res.render('newTweet');

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

router.get('/tweet-feed', function(req, res){

});

router.post('/tweets/new', function(req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB
  var newTweet = new Tweet({
    user: req.user,
    content: req.body.content
  })

  newTweet.save(function(err, tweetObj){
    if(err){
      throw err;
    } else{
      res.redirect('/');
    }
  })


});

module.exports = router;
