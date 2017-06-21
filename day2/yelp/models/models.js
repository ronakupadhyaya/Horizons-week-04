var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var FollowsSchema = mongoose.Schema({
  uid1: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  uid2: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

var Follow = mongoose.model('Follow', FollowsSchema);

// User Schema
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
    required: false
  }
});

userSchema.methods.getFollows = function (callback){
  var myThis = this
  Follow.find({uid1: myThis._id}).populate('uid2').exec(function(err, following) {
    Follow.find({uid2: myThis._id}).populate('uid1').exec(function(err, followers) {
      callback(err, followers, following);
    })
  }) 
}

userSchema.methods.follow = function (idToFollow, callback){
  Follow.find({
    uid1: this._id,
    uid2: idToFollow
  }, function(err, foundFollows) {
    if (err) {
      callback(err);
    } else {
      if (foundFollows.length == 0) {
        var newFollow = Follow({
          uid1: this._id,
          uid2: idToFollow
        });
        newFollow.save(callback);
      } else {
        callback(null);
      }
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({
          uid1: this._id,
          uid2: idToUnfollow
        })
        .remove(function(err) {
          callback(err)
        });
}

var User = mongoose.model('User', userSchema);

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ['Korean', 'Barbeque', 'Casual']
  }
  latitude: Number,
  longitude: Number,
  price: {
    type: Number,
    enum: [1,2,3]
  },
  open_time: {
    type: Number,
    enum: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  },
  closing_time: {
    type: Number,
    enum: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: User,
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
