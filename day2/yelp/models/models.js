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
    type: String //,
    // required: true
  },
  location: {
    type: String //,
    // required: true
  }
});


userSchema.methods.getFollows = function(callback) {

  var id = this._id;
  Follow.find({
      from: id
    })
    .populate('to') // expands the following.to (KEY) to become and object of all information about followed person
    .exec(function(err, following) {
      if (err) {
        console.log(err);
      } else {
        Follow.find({
            to: id
          })
          .populate('from')
          .exec(function(err, followers) {
            if (err) {
              console.log(err);
            } else {
              callback(null, {
                followers: followers,
                following: following
              })
            }
          })
      }
    })
}

userSchema.methods.follow = function(idToFollow, callback) {
  var fromID = this._id
  Follow.find({
    from: this._id,
    to: idToFollow
  }, function(err, theFollow) {
    if (err) {
      callback(err)
    } else if (theFollow) {
      callback(new Error("The follow already exists"))
    } else {
      var followObj = new Follow({
        from: fromID,
        to: idToFollow
      });

      followObj.save(function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  Follow.remove({
    from: this._id,
    to: idToUnfollow
  }, function(err, result) {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  });
}

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    required: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

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
