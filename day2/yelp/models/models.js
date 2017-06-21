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
    required: true
  }

});

userSchema.methods.getFollows = function (callback) {
  var self = this;
  Follow.find({'fromUserId': self._id}).populate('toUserId').exec(function(err, allFollowing){
    if(err) {
      callback(err)
    } else {
      Follow.find({'toUserId': self._id}).populate('fromUserId').exec(function(err, allFollowers){
        if(err) {
          callback(err)
        } else {
          callback(err, allFollowers, allFollowing);
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback) {
  var self = this;
  Follow.findOne({'fromUserId': this._id, 'toUserId': idToFollow}, function(err, followQuery){
    if(err) {
      callback(err)
    }
    if(followQuery) {
      console.log('Already following the user');
      callback(err, followQuery);
    } else {
      var newFollow = new Follow({
        fromUserId: self._id,
        toUserId: idToFollow
      })
      newFollow.save(callback)
    }
  })

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  Follow.remove({'fromUserId': self._id, 'toUserId': idToFollow}, function(err, followQuery){
    if(err) {
      console.log(':(');
      callback(err)
    }
    //if query is found, then attempt to remove query
    if(followQuery) {
      callback(null, followQuery);
    } else {
      callback(null, false)
    }
  })
}

// var FollowsSchema = mongoose.Schema({
//
// });

var followSchema = mongoose.Schema({
  //the ID of the user that follows the other aka followers id
  fromUserId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  //The ID of the user being followed aka the guy being followed
  toUserId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})


var reviewSchema = mongoose.Schema({

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
    //enum: ['Korean', 'Indian', ]
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true,
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
var Follow = mongoose.model('Follow', followSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
