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
  /* Add other fields here */
  displayName: {
    type: String,
    // required: true
  },
  location: {
    type: String
  }
});

userSchema.methods.getFollows = function (callback){
  var userId = this._id;
  var followersArr;
  var followingArr;

  Follow.find({from: userId})
  .populate('to')
  .exec(function(err, following){
    if(err){
      console.log('Error Phase 1 Get Follows')
    } else{
      followingArr = following;

      Follow.find({to: userId})
      .populate('from')
      .exec(function(err, followers){
        if(err){
          console.log('Error Phase 2 Get Follows');
        } else{
          followersArr = followers;
          callback(followersArr, followingArr);
        }
      })
    }
  })

}


userSchema.methods.follow = function (idToFollow, callback){
  var userId = this._id;
  Follow.findOne({from: userId, to: idToFollow}, function(err, follow){
    if(err){
      console.log('Error in Finding One')
    } else if(!follow){
      var newFollow = new Follow({from: userId, to: idToFollow});
      newFollow.save(function(err, follow){
        if(err){
          console.log('Error in Saving')
        } else{
          callback();
        }
      });

    }
    console.log('Nothing happened here you fuck.')
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var userId = this._id;

  Follow.remove({from: userId, to: idToUnfollow}, callback(err));

}

userSchema.methods.isFollowing = function(otherId, callback){
  var userId = this._id;

  Follow.findOne({from: userId, to: otherId}, function(err, follow){
    if(err){
      console.log('Error in finding this follow');
    } else if(!follow){
      callback(false);
    } else if(follow){
      callback(true);
    }
    console.log('Nothing happened here!!!')
  });

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

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  lattitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number

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
