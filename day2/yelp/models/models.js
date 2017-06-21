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
    type: String
  }

});


userSchema.methods.getFollows = function (callback){
  var following = [];
  var followedBy = [];
  var self = this;
  var myId = this.id;
  Follow.find({from: myId})
    .populate('to')
    .exec(function(err, allFollowing) {
      if (err) {
        callback(err);
      } else {
        Follow.find({to: myId})
        .populate('from')
        .exec(function(err, allFollowers) {
          if (err) {
            callback(err);
          } else {
            console.log("ing: "+allFollowing+" ers: "+allFollowers);
            callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
          }
        });
      }
    })
  ;
};

// userSchema.methods.getFollows = function (id, callback){

//   var allFollowers = [];
//   var allFollowing = [];
//   // Find all Users that are following the current User
//   Follow.find({to: this.id}, function(err, followsToUser) {
//     if (err) {
//       callback(err);
//       console.log('Error finding all follows to user');
//     }
//     else {
//       allFollowers = followsToUser;
//       Follow.find({from: this._id}, function(err, followsFromUser) {
//         if (err) {
//           callback(err);
//           console.log('Error finding all follows to user');
//         }
//         else {
//           allFollowing = followsFromUser;
//           callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
//         }
//       });
//     }
//   });
//   // Find all that the User is following
//   Follow.find({from: this.id}, function(err, followsFromUser) {
//     if (err) {
//       console.log('Error finding all follows to user');
//     }
//     allFollowing = followsFromUser;
//   });
//   callback(allFollowers, allFollowing);
// }

userSchema.methods.follow = function (idToFollow, callback){
  // Create a new follow from the current user to the id to follow
  self = this;
  Follow.findOne({from: this.id, to: idToFollow}, function(err, follow) {
    if (err) {
      callback(err);
      console.log('Error finding if current follow exists');
    }
    else if (follow.length !== 0) {
        callback(new Error('Follow already exists'));
    }
    else {
      var newFollow = new Follow({
        from: self.id,
        to: idToFollow
      });
      // Save the new follow to the database
      newFollow.save(function(err) {
        if (err) {
          callback(err);
          console.log('Error saving new follow to database');
        }
        else {
          callback(null);
        }
      });
    }
  });
}

userSchema.methods.isFollowing = function(user) {
  Follow.findOne({from: this._id, to: user._id}, function(err, follow) {
    if (err) {
      console.log('Error checking if is following')
    }
    else {
      if (!follow) {
        return false;
      }
      else {
        return true;
      }
    }
  });
}

userSchema.methods.getReviews = function(callback) {
  Review.find({user: this._id}, function(err, reviews) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, reviews);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToFollow}, function(err) {
    if (err) {
      callback(err);
      console.log('Error unfollowing');
    }
    else {
      callback(null);
    }
  });
}

var followSchema = mongoose.Schema({
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
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: 'Restaurant'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    min: 1,
    max: 3,
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
    required: true,
    min: 0,
    max: 23
  },
  closeTime: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  totalScore: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { toJSON: { virtuals: true } });

// Restaurant schema virtuals
var averageRatingVirtual = restaurantSchema.virtual('averageRating');

averageRatingVirtual.get(function() {
  return this.totalScore / this.reviewCount;
});


restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({ restaurant: restaurantId })
    .populate('user')
    .exec(function(err, reviews) {
      if (err) {
        callback(err);
        console.log('Error getting the reviews for the restaurant');
      }
      callback(null, reviews);
    }); 
}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
