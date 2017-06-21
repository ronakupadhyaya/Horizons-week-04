var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect').MONGODB_URI;
mongoose.connect(connect);

/*****************************************************************************
 *                   USERS SCHEMA                                            *
 *****************************************************************************/
var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  }
});

userSchema.methods.getFollows = function (callback){
  Follow.find({ to: this._id })
  .populate('from')
  .exec(function(err, followers) {

    if (!err) {
      Follow.find({ from: this._id })
      .populate('to')
      .exec(function(err, following) {

        if (!err) {
          callback(followers, following);
        } else {
          console.log("Search for following failed.");
        }

      });
    } else {
      console.log("Search for followers failed");
    }

  });
}
userSchema.methods.follow = function (idToFollow, callback){
  new Follow({
    from: this._id,
    to: idToFollow
  }).save(callback);
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({
    from: this._id,
    to: idToUnfollow
  }, callback);
}

userSchema.methods.isFollowing = function (user, callback) {
  Follow.findOne({
    from: this._id,
    to: user
  }, function(err, follow) {
    if (!err) {
      console.log(follow);
      callback(!!follow);
    } else {
      console.log("Search failed.");
    }
  });
}

/*****************************************************************************
 *                   FOLLOWS SCHEMA                                          *
 *****************************************************************************/
var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

/*****************************************************************************
 *                   REVIEW SCHEMA                                          *
 ****************************************************************************/
var reviewSchema = mongoose.Schema({

});

/*****************************************************************************
 *                   RESTAURANT SCHEMA                                       *
 *****************************************************************************/
var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
