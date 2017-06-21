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
    type: String
  }
});

//from obama to jklugherz
userSchema.methods.getFollows = function(callback) {
  var self = this._id;
  console.log(self);
  //all Following
  Follow.find({
      from: self
    })
    .populate('to')
    .exec(function(err, allFollowing) {
      //console.log('allFollowing: ', allFollowing);
      if (err) {
        callback(err)
      } else {
        Follow.find({
          to: self
        }).populate('from').exec(function(err, allFollowers) {
          //console.log('allFollowers: ', allFollowers);
          if (err) {
            callback(err)
          } else {
            callback(null, {
              allFollowers: allFollowers,
              allFollowing: allFollowing
            });
          };
        })
      }
    })
}

userSchema.methods.follow = function(idToFollow, callback) {
  var current = this._id;
  Follow.findOne({
    from: current,
    to: idToFollow._id
  }, function(err, follow) {
    //follow is a follow, or null
    if (err) {
      callback(err);
    } else if (follow) {
      console.log("You're already following that user!");
    } else {
      var newFollow = new Follow({
        from: current,
        to: idToFollow._id
      });
      console.log(newFollow);
      newFollow.save(function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    };
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  var current = this._id;
  Follow.remove({
    from: current,
    to: idToUnfollow._id
  }, function(err, result) {
    if (err) {
      callback(err)
    } else {
      callback(null, result)
    }
  });
}

userSchema.methods.isFollowing = function(id) {
  var self = this._id;
  Follow.find({
    from: self,
    to: id._id
  }, function(err, follows) {
    if (follows) {
      return true;
    } else {
      return false;
    }
  });
}


var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId, //look at User collection
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
  latitude: Number,
  longitude: Number,
  price: Number,
  openingTime: Number,
  closingTime: Number
});

restaurantSchema.methods.getReviews = function(restaurantId, callback) {

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', FollowsSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
