var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: { //hashed with bcrypt
    type: String,
    required: true
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String
  }
  /* Add other fields here */
});

/*
 getFollows(cb)
 Call cb(err, {following: [array of people following this user],
              follows: [array of people this user follows])}
*/

userSchema.methods.getFollows = function (callback){
  var viewer = this;

  //this is the user object
  Follow.find({followee: viewer._id}, function(err, followers) {
    // this user has people in followers following him
    if(err) {
      callback(err, null);
    } else {
      Follow.find({follower: viewer._id}, function(err, followees) {
        // this user follows his followees
        if(err) {
          callback(err, null);
        } else {
          callback(null, {
            followers: followers,
            followees: followees,
          });
        }
      });
    }
  })
}
// callback(err)
userSchema.methods.follow = function (idToFollow, callback) {
  //this is still the user object
  if(this._id == idToFollow) {
    var error = new Error("Don't be a narcissistic person");
    callback(error);
  } else {
    var followerUserId = this._id;
    Follow.findOne({follower: followerUserId, followee: idToFollow,}, function(err, follow) {
      if(err) {
        callback(err);
      } else {
        if(!follow) { //that follow doesn't exist yet, good
          Follow.create({
            follower: followerUserId,
            followee: idToFollow,
          }, function(err) {if(err) {
            callback(err);
          } else {
            callback(null);
          }});
        } else { //follow exists already
          var newError = new Error('That user is already following this user');
          callback(newError);
        }
      }
    });
  }
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({
    follower: this._id,
    followee: idToFollow,
  }, function(err) {if(err) {
                      callback(err);
                    }});
}
userSchema.methods.getTweets = function (callback){

}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  followee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});


var tweetSchema = mongoose.Schema({

});

tweetSchema.methods.numLikes = function (tweetId, callback){

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
