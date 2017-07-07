var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
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
    required: true
  }
  /* Add other fields here */
});

userSchema.methods.getFollows = function(callback) {
  var following;
  var followers;
  var thisId = this._id;

  Follow.find({
      from: thisId
    })
    .populate('to')
    .exec(function(err, following) {
      Follow.find({
          to: thisId
        })
        .populate('from')
        .exec(function(err, followers) {
          var followingUsers = following.map(function(user) {
            return user.to;
          });

          var followerUsers = followers.map(function(user) {
            return user.from;
          });

          callback(followingUsers, followerUsers);
        })
    });
}
userSchema.methods.follow = function(idToFollow, callback) {
  var id = this._id;
  var newFollow = new Follow({
    to: idToFollow,
    from: id
  });

  Follow.find({
    to: idToFollow,
    from: id
  }, function(err, arr) {
    if (err) {
      console.log(err);
    } else if (arr.length === 0) {
      newFollow.save(function(err) {
        callback(err);
      });
    } else {
      callback('Error: already following.');
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  var id = this._id;

  Follow.find({
    to: idToUnfollow,
    from: id
  }, function(err, arr) {
    if (err) {
      console.log(err);
    } else if (arr.length === 0) {
      callback('Not following that user.');
    } else {
      arr[0].remove(function(err) {
        callback(err);
      });
    }
  });
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  var id = this._id;
  console.log('ID of current:', id);
  console.log('ID to check:', idToCheck);

  Follow.find({
    to: idToCheck,
    from: id
  }, function(err, arr) {
    console.log(arr);
    if (err) {
      console.log(err);
    } else if (arr.length === 0) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

var FollowsSchema = mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function(restaurantId, callback) {

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
