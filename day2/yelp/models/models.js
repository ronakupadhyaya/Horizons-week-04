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
  var allFollowing = [];
  var allFollowers = [];
  var id = this._id;
  Follow.find({from: id}).populate('to').exec(function(err, f1) {
      allFollowing = f1;
      Follow.find({to: id}).populate('from').exec(function(err, f2) {
          allFollowers = f2;
          console.log("Followers: " + allFollowers);
          console.log("Following: " + allFollowing);
          callback(allFollowers, allFollowing);
        });
    });
}

userSchema.methods.follow = function (idToFollow, callback){
  var followerId = this._id;
  Follow.findOne({
    from: followerId,
    to: idToFollow
  }, function(err, follow) {
    if (err) {
      callback(err, false);
    } else if (follow !== null) {
      console.log("follow " + follow);
      callback(null, false);
    } else {
      new Follow({
        from: followerId,
        to: idToFollow
      }).save(function(err, newFollow) {
        if (err) {
          callback(err, false);
        } else {
          callback(null, newFollow);
        }
      });
    }
  });
}

// user.isFollowing(1, function(bool) {
//})
userSchema.methods.isFollowing = function(followedId, callback) {
  var followerId = this._id;
  Follow.findOne({
    from: followerId,
    to: followedId
  }, function(err, follow) {
  //  console.log("follow: " + follow);
    if (!err && follow === null) {
  //    console.log("Is NOT following");
      callback(false);
    } else if (!err && follow !== null) {
    //  console.log("IS following");
      callback(true);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var followerId = this._id;
  Follow.find({from: followerId, to: idToUnfollow}).remove().exec();
  console.log("Unfollowed successfully");
}

userSchema.methods.getReviews = function(callback) {
  Review.find({userId: this._id})
    .populate('restaurantId')
    .exec(function(err, reviews) {
      if (err) {
        console.log('user schema review: ' + reviews);
        callback(err, false);
      } else {
        callback(null, reviews);
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
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

reviewSchema.virtual('yellowStarsArr').get(function() {
  var num = this.stars;
  var array = [];
  for (var i = 0; i < num; i++) {
    array.push(i + 1);
  }
  return array;
});

reviewSchema.virtual('greyStarsArr').get(function() {
  var num = 5 - this.stars;
  var array = [];
  for (var i = 0; i < num; i++) {
    array.push(i + 1);
  }
  return array;
});

var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Korean', 'Barbeque', 'Casual'],
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
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  }
});

restaurantSchema.virtual('averageRating').get(function() {
  return totalScore/reviewCount;
});

restaurantSchema.methods.getReviews = function (callback){
  Review.find({restaurantId: this._id})
    .populate('userId')
    .exec(function(err, reviews) {
      console.log("Reviews 2: " + reviews);
      if (err) {
        callback(err, false);
      } else {
        callback(null, reviews);
      }
    });
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
