var mongoose = require('mongoose');

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
    type: String
  }
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({'to': id}).populate('from').exec(function(err, allFollowers) {
    Follow.find({'from': id}).populate('to').exec(function(err, allFollowing) {
      callback(allFollowers, allFollowing);
    });
  });
}
userSchema.methods.follow = function (idToFollow, callback){
  var thisId = this._id;
  Follow.find({'from': this._id, 'to': idToFollow}, function(err, followed) {
    if (followed.length === 0) {
      var newfollow = new Follow ({
        from: thisId,
        to: idToFollow
      });
      newfollow.save(function(err) {
        if (err) {
          console.log('error');
        }
        else {
          callback();
        }
      });
    }
    else {
      console.log("User has already been followed.");
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  Follow.remove({'from': this._id, 'to': idToUnfollow}, function(err) {
    if (err) {
      console.log('error', err);
    }
    else {
      callback();
    }
  });
}

userSchema.methods.isFollowing = function(id, callback) {
  Follow.find({'from': this._id, 'to': id}, function(err, followed) {
    if (err) {
      console.log('error');
    }
    if (followed === null) {  //has not followed yet
      callback(followed, false);
    }
    else {
      callback(followed, true); //already followed
    }
  });
}

var User = mongoose.model('User', userSchema);

var FollowsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var Follow = mongoose.model('Follow', FollowsSchema);

var reviewSchema = new mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Review = mongoose.model('Review', reviewSchema);


var restaurantSchema = new mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  stars: Number,
  price: String,
  openTime: String,
  closingTime: String
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Reviews.find({restaurantId: restaurantId}, function(err, rest) {

  });
}

//restaurantSchema.methods.stars = function(callback){
//
//}
var Restaurant = mongoose.model('Restaurant', restaurantSchema);


module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
