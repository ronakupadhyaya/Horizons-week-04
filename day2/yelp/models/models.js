var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  /* Add other fields here */
  location: {
    type: String,
    //required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var followers;
  var following;
  var thisUsersId = this._id;
  Follow.find({to: thisUsersId})
        .populate('from')
        .exec(function(err, followerFollows) {
          Follow.find({from: thisUsersId})
                .populate('to')
                .exec(function(err, followingFollows) {
                  followers = followerFollows.map(function(followerFollow) {
                    return followerFollow.from;
                  });
                  following = followingFollows.map(function(followingFollow) {
                    return followingFollow.to;
                  });
                  callback(followers, following);
                });
        });
}

userSchema.methods.follow = function (idToFollow, callback){
  var thisId = this._id;
  Follow.findOne({
    from: thisId,
    to: idToFollow,
  }, function(err, extantFollow) {
    if (err) {
      callback(err);
    } else if (extantFollow !== null) {
      callback('This follow has already happened.');
    } else {
      var newFollow = new Follow({
        from: thisId,
        to: idToFollow,
      });
      newFollow.save(callback);
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  var thisId = this._id;
  Follow.findOne({
    from: thisId,
    to: idToUnfollow,
  }, function(err, extantFollow) {
    if (err) {
      callback(err);
    } else if (extantFollow === null) {
      callback('This follow does not exist.');
    } else {
      Follow.remove({from: thisId, to: idToUnfollow}, callback);
    }
  });
}

userSchema.methods.isFollowing = function(userId, callback) {
  Follow.findOne({
    from: this._id,
    to: userId,
  }, function(err, followObject) {
    if (err) {
      callback(false);
    } else if (followObject === null) {
      callback(false);
    } else {
      callback(true);
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
