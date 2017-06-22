var mongoose = require('mongoose');
// var Schema = mongoose.Schema
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
  // newly added
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  reviews: []
});

var followsSchema = new mongoose.Schema({
  uid1: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  uid2: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = new mongoose.Schema({
  stars: Number,
  content: String,
  restaurant: String,
  user: String
});

var restaurantSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    latitude: Number,
    longitude: Number,
    openTime: Number,
    closingTime: Number,
    totalScore: Number,
    reviewCount: Number
    // {
    // toJSON:{
    //   virtuals:true
    // }
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({uid1: id})
        .populate('uid2')
        .exec(function(err, allFollowing) {
          Follow.find({uid2: id})
                .populate('uid1')
                .exec(function(err, allFollowers) {
                  callback(allFollowers, allFollowing )
                })
        })
}

userSchema.methods.follow = function (idToFollow, callback){
  var uid1 = this._id
  //check before follow
  Follow.find({uid1: uid1, uid2: idToFollow}, function(err, followings) {
    if (followings.length > 0) {

      callback(null)
    } else {
      var follow = Follow({uid1: uid1, uid2: idToFollow})
      follow.save(callback)
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var uid1 = this._id
  Follow.find({uid1:uid1, uid2: idToUnfollow}).remove(function(err) {
    callback(err)
  })
}

// newly added
userSchema.methods.isFollowing = function (userId){
  var uid1 = this._id
  //check
  Follow.find({uid1: uid1, uid2: userId}, function (err, followings) {
    if (followings.length >= 1) {
      callback(true)
    } else{
      callback(null)
    }
  })
}

userSchema.methods.getReviews = function (callback){


}

var averageRatingVirtual = restaurantSchema.virtual('averageRating')

averageRatingVirtual.get(function() {
  return this.totalScore / this.reviewCount
})

// ageVirtual.set(function(newBirthday) {
//   return getAge(newBirthday)
// })
//
restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurant: Id}).populate('user').exec(function(err, reviews) {
    callback(err, reviews)
  })
}

//restaurantSchema.methods.stars = function(callback){
//
//}
var Follow = mongoose.model('Follow', followsSchema)
var User = mongoose.model('User', userSchema)
var Review =  mongoose.model('Review', reviewSchema)
var Restaurant =  mongoose.model('Restaurant', restaurantSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
