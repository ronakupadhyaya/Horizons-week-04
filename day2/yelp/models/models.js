var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect').MONGODB_URI;
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
  displayName:{
    type: String,
    required: true
  },
  location:{
    type:String,
  }
});

var FollowsSchema = mongoose.Schema({
  useridFrom:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  useridTo:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
});

var Follow = mongoose.model('Follow', FollowsSchema);

userSchema.methods.getFollowers = function (callback){
  var allFollowing = [];
  var allFollowers = [];
  var self = this;
  Follow.find({useridFrom:self._id}).populate('useridTo').exec(function(err,foundFollow) {
    allFollowing = foundFollow;
    Follow.find({useridTo:self._id}).populate('useridFrom').exec(function(err,foundFollower) {
      allFollowers = foundFollower;
      callback(err,allFollowing,allFollowers)
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.findOne({useridFrom:self._id,useridTo:idToFollow},function(err,foundFollow) {
    if (err) {
      return callback(null);
    }
    if (!foundFollow) {
      var newFollow = new Follow({
        useridFrom:self._id,
        useridTo:idToFollow
      })
      newFollow.save(callback);
    } else {
      callback(null);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  Follow.findOne({useridFrom:self._id,useridTo:idToUnfollow}).exec(function(err,foundFollow) {
    if (err) return callback(null);
    if (!foundFollow) {
      callback(null);
    } else {
      console.log("unfollow",self._id,idToUnfollow)
      Follow.remove({useridFrom:self._id,useridTo:idToUnfollow},callback)
    }
  });
}

userSchema.methods.isFollowing = function(followid,callback) {
  Follow.find({useridFrom:this._id,useridTo:followid}).exec(function(err,foundFollow) {
    if (foundFollow !== 0) {
      callback(null);
    }else {
      callback(foundFollow)
    }
  })
}

userSchema.methods.getReviews = function (callback){
  Review.find({userId:this._id}).populate('restaurantId').exec(callback);
}

var reviewSchema = mongoose.Schema({
  content:{
    type:String,
    required:true
  },
  star:{
    type:Number,
    required:true
  },
  restaurantId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Restaurant'
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

var Review = mongoose.model('Review',reviewSchema)
var restaurantSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  latitude:Number,
  longitude:Number,
  price:{
    type:Number,
    required:true
  },
  openTime:{
    type:Number,
    required:true
  },
  closingTime:{
    type:Number,
    required:true
  }
});

restaurantSchema.methods.getReviews = function (callback){
  Review.find({restaurantId:this._id}).populate('userId').exec(callback);
}

var getReviewVirtual = restaurantSchema.virtual('averageRating');
getReviewVirtual.get(function() {
  this.getReviews(function(err, reviewArr){
    var score = 0;
    reviewArr.forEach(function(review) {
      score+=review.star;
    });
    return score/reviewArr.length;
  });
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review,
  Follow
};
