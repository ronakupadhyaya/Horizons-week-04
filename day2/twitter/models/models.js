var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
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
    // required: true
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  }
  /* Add other fields here */
});

userSchema.methods.getFollows = function (callback){
  Follow.find({follower: this._id}, function(errFindingFollows, foundFollows) {
    if (errFindingFollows) {callback("Error finding follows");}
    else {
      callback(errFindingFollows, foundFollows);
    }
  });
}
userSchema.methods.follow = function (idToFollow, callback){
  var thisId = this._id;
  Follow.findOne({following: idToFollow}, function(errFollowing, foundFollow) {
    if (errFollowing) {callback("Error following")}
    else if (foundFollow) {callback("Already following")}
    else {
      var follow = new Follow({
        following: idToFollow,
        follower: thisId
      });
      follow.save(function(errSavingFollow) {
        if (errSavingFollow) {callback("Error saving follow");}
        else {callback(errSavingFollow, follow);}
      })
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({following: idToUnfollow, follower: this._id}, function(errFindingUserToUnfollow, foundUserToUnfollow) {
    if (errFindingUserToUnfollow) {callback("Error finding user to unfollow")}
    else {
      Follow.remove({following: idToUnfollow, follower: this._id}, function(errRemoving) {
        callback(errRemoving, null);
      });
    }
  });
}
userSchema.methods.getTweets = function (callback){

}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  following: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var tweetSchema = mongoose.Schema({

});

tweetSchema.methods.numLikes = function (tweetId, callback){

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Restaurant', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
