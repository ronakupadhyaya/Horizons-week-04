var mongoose = require('mongoose');
var restaurantList = require('./restaurantList')


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

// instance of a user calls this method (anything an instance has, can be access by this)
userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({from: myId})
    .populate('to')
    .exec(function(err, allFollowing){
      if (err) {
        callback(err);
      } else {
        Follow.find({to: myId})
          .populate('from')
          .exec(function(err, allFollowers){
            if (err) {
              callback(err)
            } else {
              callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
            }
          })
      }
    });
};

// callback function to be expected to be called
userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id;
  Follow.find({from: fromId, to: idToFollow}, function(err, theFollow){
    if (err) {
      callback(err)
    } else if (theFollow) {
      callback(new Error("That follow already exists!"));
    } else {
      var newFollow = new Follow({
        from: fromId,
        to: idToFollow
      });
      newFollow.save(function(err, result) {
        if (err) {
          callback(err); // assumption that function that they gave had a first argument that is treated as an error
        } else {
          callback(null, result);
        }
      });
    }
  })
};


userSchema.methods.unfollow = function (idToUnfollow, callback){
  var fromId = this._id
  Follow.remove({to: idToUnfollow, from: fromId}, function(err, result){
    if (err) {
      callback(err)
    } else {
      callback(null, result)
    }
  });
};

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }
});

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
    type: mongoose.Schema.ObjectId,
    ref: 'restaurant'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }

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
    enum: restaurantList,
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
