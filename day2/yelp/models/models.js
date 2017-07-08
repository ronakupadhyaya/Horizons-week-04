var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  /* Add other fields here */
  displayName: String,
  location: String
});

//var User = mongoose.model("User", userSchema);

userSchema.methods.getFollows = function(callback){
  var self = this;
  Follow.find({to: self._id})
    .populate("from")
    .exec(function(err, followers) {
      if (err) {
        console.log("ERROR", err);
      } else {
        var allFollowers = followers;
        Follow.find({from: self._id})
          .populate("to")
          .exec(function(err, followings) {
            if (err) {
              console.log("ERROR", err);
            } else {
              var allFollowings = followings;
              callback(err, {
                allFollowers: allFollowers,
                allFollowings: allFollowings
              });
            }
          });
        }
    });
  }

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.findOne({from: self._id, to: idToFollow}, function(err, user) {
    if (err) console.log("ERROR", err);
    else if (user) console.log("You have already followed this user!");
    else {
      var newFollow = new Follow({
        from: self._id,
        to: idToFollow
      });
      newFollow.save(callback);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  Follow.findOne({from: self._id, to: idToUnfollow}, function(err, followed) {
    if (err) console.log('ERROR', err);
    else if (!followed) console.log("You haven't followed this user yet!");
    else followed.remove(callback);
  })
}

userSchema.methods.isFollowing = function (idToCheck, callback){
  Follow.findOne({from: this._id, to: idToCheck}, function(err, follow) {
    if (err) console.log(err);
    else if (!follow) callback(false);
    else callback(true);
  })
}

var FollowsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

var reviewSchema = new mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});


var restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closeTime: Number,
  totalScore: Number,
  reviewCount: Number
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
