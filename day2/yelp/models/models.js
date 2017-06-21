var mongoose = require('mongoose');


// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: String,
  location: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var self = this;
  Follow.find({from: self._id}).populate('to').exec(function(error, following) {
    Follow.find({to: self._id}).populate('from').exec(function(error, followers) {
      console.log("Following", following);
      console.log("Followers", followers);
      callback(following, followers);
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  if (self.isFollowing(idToFollow)) {
    console.log("Follow already exists")
  } else {
    var newFollow = new Follow({
      from: self._id,
      to: idToFollow
    });
    console.log(newFollow);
    newFollow.save(callback);
  }
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  console.log("myId", self._id);
  console.log("idToUnfollow", idToUnfollow);
  Follow.findOneAndRemove({from: self._id, to: idToUnfollow}, callback);
}

userSchema.methods.isFollowing = function(idToCheck) {
  var self = this;
  Follow.findOne({from: self._id, to: idToCheck}, function(error, foundFollow) {
    if(error) {
      console.log("Error finding follow");
      return false;
    } else if (foundFollow) {
      return true;
    } else {
      return false;
    }
  })
}

userSchema.methods.getReviews = function (userId, callback) {
  Review.find({userId: userId}).populate('restaurantId').exec(function(error, foundReviews) {
    callback(foundReviews);
  });
}

var FollowsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = new mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = new mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  open: Number,
  close: Number,
  totalScore: Number,
  reviewCount: Number
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {
  Review.find({restaurantId: restaurantId}).populate('userId').exec(function(error, foundReviews) {
    callback(foundReviews);
  });
}

var ratingVirtual = restaurantSchema.virtual('averageRating');

ratingVirtual.get(function() {
  return this.totalScore/this.reviewCount;
});

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
