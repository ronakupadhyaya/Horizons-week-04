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
});

userSchema.methods.getFollows = function(callback) {
  var following;
  var followers;

  var thisUsersId = this._id;

  Follow.find({
      from: thisUsersId
    })
    .populate('to')
    .exec(function(err, followings) {
      Follow.find({
          to: thisUsersId
        })
        .populate('from')
        .exec(function(err, followers) {

          var followingUsers = followings.map(function(user) {
            return user.to;
          })

          var followerUsers = followers.map(function(user) {
            return user.from;
          })

          callback(followingUsers, followerUsers);
        })
    })
}

userSchema.methods.follow = function(idToFollow, callback) {
  var self = this;

  Follow.find({
    to: idToFollow,
    from: self._id
  }, function(err, arr) {
    if (arr.length == 0) {
      var follow = new Follow({
        to: idToFollow,
        from: self._id
      });
      follow.save(function(err) {
        callback(err);
      });
    } else {
      callback('Error: Already following')
    }
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  var self = this;

  Follow.find({
    to: idToUnfollow,
    from: self._id
  }, function(err, arr) {
    if (arr.length == 0) {
      callback('Error: Must be following to unfollow');
    } else {
      arr[0].remove(function(err) {
        callback(err);
      });
    }
  })
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  var id = this._id;

  Follow.findOne({
    to: idToCheck,
    from: id
  }, function(err, follow) {
    if (!follow) {
      callback(false)
    } else {
      callback(true)
    }
  })
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
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  openTime: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  closingTime: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  }
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