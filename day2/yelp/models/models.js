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
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function(callback){
  // find who user is following (leaders)
  var id = this._id;
  Follow.find({'follower': id})
  .populate('leader')
  .exec(function(err, foundLeaders){
    Follow.find({'leader': id})
    .populate('follower')
    .exec(function(err, foundFollowers){
      mappedFollowers = foundFollowers.map(function(obj){
        return obj.follower;
      });
      mappedLeaders = foundLeaders.map(function(obj){
        return obj.leader;
      });
      callback(mappedFollowers, mappedLeaders);
    })
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var myId = this._id;
  Follow.findOne({'leader': idToFollow, 'follower': myId}, function(err, foundFollow){
    if(foundFollow){
      console.log("User is already followed by you");
      callback(false);
    }else{
      var newFollow = new Follow({'leader': idToFollow, 'follower': myId});
      newFollow.save(callback);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var myId = this._id;
  Follow.find({'leader': idToUnfollow, 'follower': myId}).remove(callback);
}

userSchema.methods.isFollowing = function(leaderId, callback){
  Follow.findOne({'follower': this._id, 'leader': leaderId}, function(err, foundFollow){
    if(err){
      console.log("Database error");
    }else if(foundFollow){
      callback(true);
    }else{
      callback(false);
    }
  });
}

userSchema.methods.getReviews = function(callback){
  var userId = this._id;
  Review.find({'user': userId})
  .populate('restaurant')
  .exec(function(err, foundReviews){
    if(err){
      res.status(500).send("Database error");
      console.log("database error :'( ");
    }else{
      callback(foundReviews);
    }
  });
}

var followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  leader: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = new mongoose.Schema({
  content: String,
  stars: Number,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user: {
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
    enum: [
      'Chinese',
      'American',
      'Meal Plan'
    ],
    default: 'Meal Plan'
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true,
    enum: [
      '$',
      '$$',
      '$$$'
    ]
  },
  openTime: {
    type: Number,
    required: true
  },
  closeTime: {
    type: Number,
    requried: true
  },
  reviewCount: {
    type: Number,
    required: true,
    default: 0
  },
  totalScore: {
    type: Number,
    required: true,
    default: 0
  }
});

restaurantSchema.methods.getReviews = function (callback){
  var restaurantId = this._id;
  Review.find({'restaurant': restaurantId})
  .populate('user')
  .exec(function(err, foundReviews){
    if(err){
      console.log("database error");
      res.status(500).send("Database error!!! :( ");
    }else{
      callback(foundReviews);
    }
  });
}

var averageRatingVirtual = restaurantSchema.virtual('averageRating');

averageRatingVirtual.get(function(){
  if(this.reviewCount===0){
    return 0;
  }else{
    return Math.floor(this.totalScore / this.reviewCount);
  }
});

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
