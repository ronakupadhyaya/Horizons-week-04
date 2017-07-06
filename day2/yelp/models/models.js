var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  /* Add other fields here */
  displayName: {
    type: String,
    required: true
  },
  location: String
});

userSchema.methods.getFollows = function (callback){
  var allFollowers = [];
  var allFollowing = [];
  Follow.find({to: this._id}) //retrieve all Follow documents where user is being followed (from someone, to user)
    .populate('from')
    .exec(function(err, follows) {
      allFollowers = follows;
    });
  Follow.find({from: this._id})
    .populate('to')
    .exec(function(err, follows) {
      allFollowing = follows;
    });
  callback(allFollowers, allFollowing);
}

userSchema.methods.follow = function (idToFollow, callback){
  var followerId = this._id;
  Follow.find({
    from: followerId,
    to: idToFollow
  }, function(err, follow) {
    if (err) {
      callback(err, false);
    } else if (follow === null) {
      callback(null, false);
    } else {
      new Follow({
        from: followerId,
        to: idToFollow
      }).save(function(err, newFollow) {
        if (err) {
          callback(err, false);
        } else if (follow === null) {
          callback(null, false);
        } else {
          callback(null, newFollow);
        }
      });
    }
  });
}

userSchema.methods.isFollowing = function(followedId, callback) {
  var followerId = this._id;
  Follow.find({
    from: followerId,
    to: followedId
  }, function(err, follow) {
    if (!err && follow !== null) {
      callback(true);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var followerId = this._id;
  Follow.find({
    from: followerId,
    to: idToUnfollow
  }, function(err, follow) {
    if (err) {
      callback(err, false);
    } else if (follow == null) {
      callback(null, false);
    } else {
      follow.remove();
      callback(null, follow);
    }
  });
}

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

var reviewSchema = mongoose.Schema({

});


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
