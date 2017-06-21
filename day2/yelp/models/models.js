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
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String,
  }
});

var FollowSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

userSchema.methods.getFollows = function (id, callback) {
  var allFollowers = [];
  var allFollowing = [];
  Follow.find({
    'from': id
  }).populate('to', ['_id', 'displayName', 'email']).exec(function (err, users) {
    if (err) {
      callback(null);
    }

    allFollowing = users;
    /////////

    Follow.find({
      'to': id
    }).populate('from', ['_id', 'displayName', 'email']).exec(function (err, users) {
      if (err) {
        callback(null);
      }

      allFollowers = users;
      /////////////
      callback(allFollowers, allFollowing);
    });

  });

}


userSchema.methods.follow = function (idToFollow, callback) {

  var id = this._id;
  Follow.find({
    'to': idToFollow,
    'from': this._id
  }).exec(function (err, user) {
    if (err) {
      console.log("there was an error searching for idToFollow")
    } else {
      if (user.length === 0) {
        var follow = new Follow({
          from: id,
          to: idToFollow
        });
        follow.save(callback);
      } else {
        callback(null);
      }
    }
  })

}

userSchema.methods.unfollow = function (idToUnfollow, callback) {

  var id = this._id;
  Follow.find({
    'from': this._id,
    'to': idToUnfollow
  }).exec(function (err, users) {
    if (err) {
      console.log("there was an error searching for idToFollow")
    } else {
      if (users.length === 0) {
        console.log("nothing to remove");
      } else {
        users[0].remove();
      }
    }
  })
}

userSchema.methods.isFollowing = function (idToCheck, callback) {
  var id = this._id;
  Follow.find({
    'from': id,
    'to': idToCheck
  }).exec(function (err, user) {
    if (err) {
      console.log(err);
      callback(null);
    } else if (user.length === 1) {
      callback(true);
    } else {
      callback(false);
    }
  })
}


var reviewSchema = mongoose.Schema({
  contents: {
    type: String
  },
  stars: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }

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
  address: {
    type: String
  },
  price: {
    type: Number,
    enum: [1, 2, 3]
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  openTime: {
    type: Number
  },
  closeTime: {
    type: Number
  },
  totalScore: {
    type: Number
  },
  reviewCount: {
    type: Number
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {
  Review.find({
      'restaurantId': restaurantId
    })
    .populate('userId', ['_id', 'displayName', 'email'])
    .exec(function (err, reviews) {
      if (err) {
        callback(null);
      } else {
        callback(reviews)
      }

    })
}

userSchema.methods.getReviews = function (userId, callback) {
  Review.find({
      'userId': userId
    })
    .populate('restaurantId', ['name', 'email'])
    .exec(function (err, reviews) {
      if (err) {
        calback(err)
      } else {
        callback(reviews);
      }
    })
}

restaurantSchema.virtual('averageRating').get(function () {
  return (this.totalScore / this.reviewCount);
});

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
}
