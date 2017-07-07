var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: String,
  location: String
});

userSchema.methods.getFollowings = function(callback) {
  var allFollowing = [];
  Follow.find({from: this._id})
    .populate('to')
    .exec(function(err, users) {
      if (err) {
        console.log(err);
      } else if (users.length) {
        users.forEach(function(item) {
          allFollowing.push(item);
        })
        callback(err, allFollowing)
      } else {
        console.log("You aren't following anyone.")
        callback(err, allFollowing)
      }
    })
}

userSchema.methods.getFollowers = function(callback) {
  var allFollowers = [];
  Follow.find({to: this._id})
    .populate('from')
    .exec(function(err, users) {
      if (err) {
        console.log(err);
      } else if (users.length) {
        users.forEach(function(item) {
          allFollowers.push(item);
        })
        callback(err, allFollowers)
      } else {
        console.log("You have no followers.")
        callback(err, allFollowers)
      }
    })
}

userSchema.methods.follow = function(idToFollow) {
  var id = String(this._id)
  var idToFollow = String(idToFollow)
  if (id === idToFollow) {
    console.log("Don't follow yourself.")
  } else {
    Follow.findOne({from: this._id, to: idToFollow}, function(err, user) {
      if (err) {
        console.log(err)
      } else if (user) {
        console.log("You've already followed that user, you creep!")
      } else {
        new Follow({
          from: id,
          to: idToFollow
        }).save(function(err) {
          if (err) {
            console.log(err)
          } else {
            console.log("It worked!")
          }
        })
      }
    })
  }
}

userSchema.methods.unfollow = function(idToUnfollow) {
  Follow.findOne({from: this._id, to: idToUnfollow}, function(err, user) {
    if (err) {
      console.log(err)
    } else if (user) {
      user.remove();
    } else {
      console.log("You aren't following that user.")
    }
  })
}

userSchema.methods.isFollowing = function(user) {
  Follow.find({from: this._id, to: user}, function(err, followed) {
    if (err) {
      console.log(err)
    } else if (followed) {
      return true
    } else {
      return false
    }
  })
}

userSchema.methods.getReviews = function(callback) {

}

var FollowsSchema = Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = Schema({
  stars: Number,
  content: String,
  restaurant: {
    type: Schema.ObjectId,
    ref: 'Restaurant'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = Schema({
  name: String,
  price: String,
  category: String,
  address: String,
  openTime: String,
  closingTime: String,
  totalScore: Number,
  reviewCount: Number,
  apiKey: String
});

restaurantSchema.methods.getReviews = function(restaurantId, callback) {

}

var restaurantVirtual = restaurantSchema.virtual('averageRating');

restaurantVirtual.get(function() {

})

// restaurantSchema.methods.stars = function(callback){
//
// }

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
