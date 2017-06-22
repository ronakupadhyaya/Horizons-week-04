var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: String,
  location: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (callback) {
  var resultObj = {};
  var myId = this.id;
  Follow.find({ fromId: myId })
    .populate('toId')
    .exec(function (err, follows) {
      if (err) {
        callback(err);
      } else {
        resultObj.allFollowing = follows;
        Follow.find({ toId: myId })
          .populate('fromId')
          .exec(function (err, follows) {
            resultObj.allFollowers = follows;
            callback(err, resultObj);
          })
      }
    })
}

userSchema.methods.follow = function (idToFollow, callback) {
  var fromId = this._id;
  Follow.findOne({
    fromId: fromId,
    toId: idToFollow
  }, function (err, follow) {

    if (err) {
      callback(err);
    }

    else if (follow) {

      callback(new Error("ALREADY FOLLOWING!!!"))
    }
    else if (!follow) {
      var newFollow = new Follow({
        fromId: fromId,
        toId: idToFollow
      });
      newFollow.save(callback);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback) {
  Follow.remove({
    toId: idToUnfollow,
    fromId: this._id
  }, callback);
}

userSchema.methods.isFollowing = function (idToFollow, callback) {
  Follow.findOne({ fromId: this._id, toId: idToFollow }, function (err, follow) {
    if (follow) {
      callback(err, true);
    } else {
      callback(err, false);
    }
  })
}

var followSchema = mongoose.Schema({
  fromId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  toId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  // To start off the basics of the Restaurants model,
  // let's create some fundamental properties for what make a restaurant a restaraunt.
  // The ones we thought of are as follows:
  Name: String,
  Category: String,
  Latitude: Number,
  Longitude: Number,
  Price: Number, //- the descriptive scaling of a restaurants price, on a scale of 1-3
  Open: Number,  //an hour of opening time (assume Eastern Time, UTC-4) between 0-23
  Closing: Number //- an hour of closing time between 0-23
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {



}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
