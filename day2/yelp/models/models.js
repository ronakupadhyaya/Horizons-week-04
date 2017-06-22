var mongoose = require('mongoose');
// var Schema = mongoose.Schema()

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
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


userSchema.methods.getFollows = function (callback){
  // Follow.find({from: id}).populate('to').exec(function(err, following){
  //   Follow.find({to: id}).populate('from').exec(function(err, followers){
  //     console.log(id, following, followers);
  //     callback(err, following, followers);
  //   })
  // }
  var fromId = this._id;
  Follow.find({from: fromId})
  .populate('to')
  .exec(function(err, allFollowing) {
    console.log('allFollowing', allFollowing);
    if(err) {
      callback(err)
    } else {
      Follow.find({to: fromId})
      .populate('from')
      .exec(function(err, allFollowers) {
        if(err) {
          callback(err)
        } else {

          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var fromID = this._id;
  Follow.findOne({from: this._id, to: idToFollow}, function(err, theFollow){
    if(err) {
      callback(err)
    } else if(theFollow){
      callback(new Error("That follow already exists!"));
    } else{
      var newFollow = new Follow({
        to: idToFollow,
        from: fromID
      })
      newFollow.save(function(err, result) {
        callback(err, result);
      });
    }
  })
}
  // newFollow.save(function(err, result) {
  //   if(err) {
  //     callback(err);
  //   } else{
  //     callback(null, result);
  //   }
  //   callback(err,result)
  // })

  // newFollow.save(function(err, result) {
  //   callback(err, result);
  // })



userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this._id}, function(err, result){
    if(err){
      callback(err)
    } else{
      callback(null, result);
    }
  });
}

userSchema.methods.isFollowing = function (user) {
  Follow.findOne({from: this._id, to: user}, function(err, isFollowing){
    if(err) {
      callback(err)
    } else if(isFollowing){
      callback(null, isFollowing);
    } else{
      callback(null, false);
    }
  })
}

userSchema.methods.getReviews = function (cb) {

}

var FollowsSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = new mongoose.Schema({

});


var restaurantSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    required: true
  },
  Latitude: {
    type: Number,
    required: true
  },
  Longitude: {
    type: Number,
    required: true
  },
  relativePrice: {
    type: Number,
    min: 1,
    max: 3,
    required: true
  },
  openTime: {
    type: Number,
    min: 0,
    max: 23,
    required: true
  },
  closeTime: {
    type: Number,
    min: 0,
    max: 23,
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
