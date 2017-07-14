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

var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
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
  openTime: {
    type: Number,
    required: true
  },
  closingTime: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  }
})

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  restaurant: {
    type: Number,
    required: true
  },
  user: {
    type: Number,
    required: true
  }
});

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


userSchema.methods.getFollows = function (callback){
  var following;
  var followers;
  var thisUsersId = this._id;
  Follow.find({ from: thisUsersId })
    .populate('to')
    .exec(function(err, followings) {
      Follow.find({ to: thisUsersId })
      .populate('from')
      .exec(function(err, followers) {
        console.log(err);
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


userSchema.methods.follow = function (idToFollow, callback){
  var id = this._id;
  var newFollow = new Follow({
    to: idToFollow,
    from: id
  });
  newFollow.save(function(err) {
    callback(err);
  });
}


userSchema.methods.unfollow = function (idToUnfollow, callback){
  var id = this._id;
  Follow.findByIdAndRemove(idToUnfollow, function(err, followObject)) {
    if (err) {
      return err;
    }
  }
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}
//
// userSchema.methods.toggleGender = function () {
//   if (this.gender === "male") {
//     this.gender = "female";
//   } else {
//     this.gender = "male";
//   }
// }
//
// follow(idToFollow, cb) - create and save a new Follow object with this._id as the from (see below) and idToFollow as to
// unfollow(idToUnfollow, cb) - find and delete a Follow object (if it exists!)
// getFollows(cb) - return array of followers and users followed as User objects in callback cb
// isFollowing(user) - return whether or not the user calling isFollowing is following the User model
// getReviews(cb) - Completed in Step 3: return array of reviews as Review objects in callback cb

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
