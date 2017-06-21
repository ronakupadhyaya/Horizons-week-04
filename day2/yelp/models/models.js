var mongoose = require('mongoose');
// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

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
  }
});

var restaurantSchema = mongoose.Schema({
  name: String,
  Category: String,
  Latitude: Number,
  Longtitude: Number,
  Price: Number,
  OpenTime: Number,
  ClosingTime: Number
})

userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({from: myId})
  .populate('to')
  .exec(function(err, allFollowing){
    if(err) {
      callback(err)
    } else {
      Follow.find({to: myId})
      .populate('from')
      .exec(function(err, allFollowers){
        if(err) {
          callback(err)
        } else {

          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }
  })
}

//Jay's solution
  // var self = this; //you need to nest due to async
  // Follow.find({to: self._id}).populate('from').exec(function(err, followers) {
  //   console.log(err);
  //   console.log(followers);
  //   Follow.find({from: self._id}).populate('to').exec(function(err, following) {
  //     console.log(err);
  //     console.log(following);
  //     callback(followers, following)
  //   })
  // });
// }

userSchema.methods.follow = function (idToFollow, callback){
  var fromID = this._id;
  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
    if(err){
      callback(err)
    } else if (theFollow){
      callback(new Error("That follow already exists!"))
    } else {
      var newFollow = new Follow({
        to: idToFollow,
        from: fromID
      });
      newFollow.save(function(err, result){
        if(err){
          callback(err);
        } else {
          callback(null,result);
        }
      });
    }
  })

  // User.findOne(follow, function(err, found){
  //   console.log(err);
  //   console.log(found);
  //   if (!found){
  //     follow.save(function(err, e){
  //       if(err){
  //         console.log('Problem when saving');
  //         callback(false);
  //       } else {
  //         callback(true);
  //       }
  //     })
  //   } else {
  //     callback .(false);
  //   }
  // })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this._id}, function(err, result){
    if(err){
      callback(err)
    } else {
      callback(null, result);
    }
  });
}
  // var follow = new Follow({
  //   from: this._id,
  //   to: idToFollow
  // })
  // User.findOne(follow, function(err, found){
  //   if (!found){
  //     follow.remove(function(err, e){
  //       if(err){
  //         console.log('Problem when deleting');
  //         callback(false);
  //       } else {
  //         callback(true);
  //       }
  //     })
  //   } else {
  //     callback(false);
  //   }
  // })
// }

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
