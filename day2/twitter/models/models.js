var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
<<<<<<< HEAD
=======
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

>>>>>>> master
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    default: 'https://horizons-static.s3.amazonaws.com/horizons_h.png'
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  }
  /* Add other fields here */
});

userSchema.methods.getFollows = function (callback) {

}

userSchema.methods.follow = function (idToFollow, callback) {
  var newFollow = new Follow({
    follower: this._id,
    following: idToFollow
  });
  newFollow.save(function (error, result) {
    if (error) {
      callback(error)
    } else
      callback(null, result)
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback) {
  Follow.findOneAndRemove({
    follower: this._id,
    following: idToUnfollow
  }, function (error, deleted) {
    if (error) {
      callback(error);
    } else {
      callback(null, deleted)
    }
  })
}
userSchema.methods.getTweets = function (callback) {

}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  following: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

tweetSchema.methods.numLikes = function (tweetId, callback) {

}

var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
