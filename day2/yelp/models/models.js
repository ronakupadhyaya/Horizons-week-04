var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGO_URI || require('./connect');
mongoose.connect(connect);

var userSchema = Schema({
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

userSchema.methods.getFollows = function (id, callback){
  Follow.find({to: id}, callback);
}
userSchema.methods.follow = function (idToFollow, callback){
  var newFollow = new Follow({from: this._id, to: idToFollow});
  newFollow.save(callback);
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({to: idToUnfollow}).remove(callback);
}

var FollowsSchema = Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }

});

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  content: String,
  restaurant: {
    type: Schema.ObjectId,
    ref: "Restaurant"
  },
  user: {
    type: Schema.ObjectId,
    ref:"User"
  }
});


var restaurantSchema = mongoose.Schema({
  name: String,
  price: {
    type: Number,
    min:1,
    max:3
  },
  category: String,
  latitude: Number,
  longitude: Number,
  openTime: {
    type: Number,
    min: 0,
    max: 23
  },
  closingTime: {
    type: Number,
    min: 0,
    max: 23
  },
  totalScore: Number,
  reviewCount: Number

});

restaurantSchema.virtual("averageRating", function() {
  return this.totalScore/this.reviewCount;
})

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurant: restaurantId}, callback);
}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
