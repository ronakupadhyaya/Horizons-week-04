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


var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

var reviewSchema = mongoose.Schema({
//TO DO
});


var restaurantSchema = mongoose.Schema({
//TO DO
});



userSchema.methods.isFollowing = function(id, callback) {
  Follow.findOne({from: this._id, to: id}, function(err, follow) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, !!follow);
      }
  });
};

userSchema.methods.getFollows = function (callback){
  Follow.find({from: this._id}).populate("User").exec(function(err, allFollowedUsers) {
    if (err) {
      console.log("Server error");
      callback(err, null, null);
    } else {
      Follow.find({to: this._id}).populate("User").exec(function(err, allFollowingUsers) {
        if (err) {
          console.log("Server error");
          callback(err, null, null);
        } else {
          callback(null, allFollowedUsers, allFollowingUsers);
        }
      });
    }
  });
};


// User.findById(id, function(err, user) {
//   user.follow('123', function(err, result) {
//     if (err) {
//
//     } else {
//       check result..
//     }
//   })
// })


userSchema.methods.follow = function (idToFollow, callback){
  var followObj = new Follow({from: this._id, to: idToFollow});
  Follow.findOne({from: this._id, to: idToFollow}, function(err, follow) {
    if (err) {
      console.log("Server error");
      callback(err, {success: false});
    } else {
      if (!follow) {
        followObj.save(function(err1, savedObject) {
          if (err1) {
            callback(err1, {success: false});
          } else {
            console.log(savedObject);
            callback(null, {success: true});
          }
        });
      } else {
        console.log("Already following user");
        callback(err, {success: false});
      }
    }
  });
};

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToFollow}, function(err) {
    if (err) {
      console.log("Server error");
      callback(err, {success: false});
    } else {
      callback(null, {success: true});
    }
  });
};


restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
