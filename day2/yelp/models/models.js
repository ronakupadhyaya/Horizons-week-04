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
  displayName: String,
  location: String
  /* Add other fields here */
});

userSchema.methods.getFollowing = function(callback) {
  Follow.find({from: this._id})
  .populate('to')
  .exec(function(err, follows) {
    if (err) {
      console.log("could not find who you re following")
    } else if (follows) {
      return callback(follows)
    } else {
      console.log("You are not following anyone")
    }
  })
}

userSchema.methods.getFollowers = function(callback) {
  console.log("this._id: " + this._id)
  Follow.find({to: this._id})
  .populate('from')
  .exec(function(err, follows) {
    if (err) {
      console.log("could not find who is following you")
    } else if (follows){
      console.log('follows: ' + follows)
      return callback(follows)
    } else {
      console.log("nobody is following you")
    }
  })
}

userSchema.methods.follow = function (idToFollow){
  var userid = String(this._id)
  Follow.findOne({from: userid, to: idToFollow}, function(err, followObj) {
    if (err) {
      console.log('error checking for follow')
    } else if (followObj) {
      console.log('you already followed that user')
    } else {
      new Follow({
        from: userid,
        to: idToFollow
      }).save(function(err) {
        if (err) {
          console.log("could not create new follow")
        } else {
          console.log("follow created")
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({from: this._id, to: idToUnfollow}, function(err) {
    if (err) {
      console.log("Could not unfollow user")
    } else {
      callback()
    }
  })
}

userSchema.methods.isFollowing = function (idToCheck, callback) {
  Follow.findOne({from: this._id, to: idToFollow}, function(err, followObj) {
    if (err) {
      console.log('error checking for follow')
    } else if (followObj) {
      callback(true)
    } else {
      callback(false)
    }
  })
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
  content: String,
  stars: Number,
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
  name: String,
  category: String,
  price: Number,
  address: String,
  openTime: String,
  closeTime: String,
  reviewCount: Number,
  totalScore: Number
});

restaurantSchema.virtual('averageRating').get(function () {
  console.log('rating: ' + Math.round(this.totalScore / this.reviewCount * 10) / 10)
  console.log(this.totalScore)
  console.log(this.reviewCount)
  return Math.round(this.totalScore / this.reviewCount * 10) / 10;
});

restaurantSchema.methods.getReviews = function (callback){
  console.log('this._id: ' + this._id)
  Review.find({restaurant: String(this._id)})
  .populate('user')
  .exec(function(err, reviews) {
    if (err) {
      console.log("could not find reviews for this restaurant")
    } else {
      console.log('reviews: ' + reviews)
      callback(reviews)
    }
  })
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
