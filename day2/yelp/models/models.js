var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    // required: true
  },
  location: {
    type: String,
    // required: true
  }
});


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

var reviewSchema = new mongoose.Schema({
  content: String,
  stars: Number,
  restId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  price: {
    type: Number,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {
  Review.find({restId: this._id})
  .populate('userId')
   .exec(function(err, reviews){
    if(!err) {
      console.log(err);
      callback(null);
      return;
    }
    else {
      callback(reviews);
    }
  })
};

//restaurantSchema.methods.stars = function(callback){
//
//}




userSchema.methods.getFollows = function (callback) {
  // the callback should look like (followers, following)
  // for now, assume that an id is provideds
  var self = this;
  Follow.find({ 'to': self._id }).populate('from').exec(function (err1, followers) {
    if (err1) {
      console.log(err1);
      callback(null, null);
      return;
    }
    Follow.find({ 'from': self._id }).populate('to').exec(function (err2, following) {
      if (err2) {
        console.log(err2);
        callback(null, null);
        return;
      }
      callback(followers, following);
    });
  });



}


userSchema.methods.follow = function (idToFollow, callback) {
  var self = this;
  User.findOne({'to': idToFollow, 'from': self._id }, function(err, follow){
     if(!follow) {
        var newFollow = new Follow({
          from: self._id,
          to: idToFollow
        });
        newFollow.save(function(err, succ) {
          callback(newFollow);

        });
     }
     else{
       console.log('Already following this person');
       callback(null);
       return;
     }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback) {
  User.remove({'to': idToUnfollow, 'from': this._id}, function(err, removed){
    // removed is the count of removed documents
    if (err) {
      console.log(err);
      callback(null);
      return;
    }
    callback(removed);
  });
}

userSchema.methods.isFollowing = function (id, callback) {
  this.count({'to': id, 'from': this._id}, function(err, c){
    if(c > 0){
      callback(true);
    }
    else{
      callback(false);
    }
  })
}

userSchema.methods.getReviews = function (userId, callback) {
  Review.find({userId: this._id})
  .populate('restId')
   .exec(function(err, reviews){
    if(!err) {
      console.log(err);
      callback(null);
      return;
    }
    else {
      callback(reviews);
    }
  })
};

var averageRating = restaurantSchema.virtual('averageRating');
averageRating.get(function(){
  Review.find({restaurantId: this._id}, function(err, reviews){
    var sum = reviews.reduce(function(x,y){
      return x+y.stars;
    }, 0);
    var avg = 0;
    if(reviews.length !== 0){
      avg = sum/reviews.length;
    }
    return avg;
  })
})

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
var Restaurant = mongoose.model('Restaurant',restaurantSchema);

module.exports = { User, Restaurant, Review, Follow };

