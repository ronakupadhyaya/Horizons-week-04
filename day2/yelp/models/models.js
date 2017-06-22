var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: String
});

userSchema.methods.getFollows = function (id, callback){
  var isFollowing = []
  var allFollowers= []
  Follow.find({userId1: this._id}).populate('userId2').exec(function(err, following) {
    Follow.find({userId2: id}).populate('userId1').exec(function(err, followers) {
      for (var i=0; i<following.length; i++) {
        isFollowing.push(following[i].userId2)
      }
      for (var i=0; i<followers.length; i++) {
        allFollowers.push(followers[i].userId1)
      }
      callback(isFollowing, allFollowers)
    })
  })
}

// user.getFollows(id, function(following, follows){
//
// })

userSchema.methods.follow = function (idToFollow, callback){
// User.follow(idToFollow, callback)
  var thisId = this._id
  Follow.findOne({userId1: this._id, userId2: idToFollow}, function(err, follow) {
    if (!follow) {
      var newFollow = new Follow ({
        userId1: thisId,
        userId2: idToFollow
      })
      newFollow.save(callback)
    } else if (follow) {
    console.log('Error! Already following')
    }
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  var thisId = this._id
 Follow.remove({userId1: thisId, userId2: idToUnfollow}, function(err) {
   if (err) {
     console.log('Error', err)
   }
 })
}

userSchema.methods.isFollowing = function (id, callback) {
  Follow.findOne({userId1: this._id , userId2:id }, function (err, person) {
    if (person) {
      callback(true)
    }
  })
}

userSchema.methods.getReviews = function(userId, callback) {
  Review.find({userId: this._id}).populate('restaurantId').exec(function(err, reviews) {
    callback(error, reviews)
  })
}

var FollowsSchema = mongoose.Schema({
  userId1: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  userId2: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }

});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restuarant'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  opentime: Number,
  closetime: Number,
  totalScore: Number,
  reviewCount: Number
}, {
  toJSON: {
  virtuals:true
}
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurantId: this._id}).populate('userId').exec(function(err, reviews) {
    callback(err, reviews)
  })
}

var averageRatingVirtual = restaurantSchema.virtual('averageRating')

averageRatingVirtual.get(function() {
  if(this.totalScore===0 && this.reviewCount === 0) {
    return 0
  } else {
    return this.totalScore/this.reviewCount
  }
})


//restaurantSchema.methods.stars = function(callback){
//
//}
var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
