var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);
var Schema = mongoose.Schema;

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
    type: String
  },
  location: {
    type: String
  },
  totalScore: {
    type: Number
  },
  reviewCount: {
    type: Number
  }
});

var followSchema = new Schema ({
  fromUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

var restaurantSchema = new Schema ({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
},{
  toJSON:{
    virtuals:true
  }
});

userSchema.methods.getFollows = function (callback){
  var userId = this._id;
  Follow
  .find({fromUser: userId})
  .populate('toUser')
  .exec({fromUser: userId}, function(err, following) {
    if (err) {
      callback(err)
    }
    else {
      Follow
      .find()
      .populate('fromUser')
      .exec({toUser: userId}, function(err, followers) {
        if (err) {
          callback(err)
        }
        else {
          callback(null, {allFollowers: followers, allFollowing: following})
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var userId = this._id;
  Follow.findOne({fromUser: userId, toUser: idToFollow}, function(err, result) {
    if (err) {
      callback(err);
    }
    else if (result) {
      callback(new Error("That follow already exists"))
    }
    else {
      var newFollow = new Follow({
        fromUser: userId,
        toUser: idToFollow
      });
      newFollow.save(function(err, result) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, result);
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var userId = this._id;
  Follow.remove({fromUser: userId, toUser: idToUnfollow}, function(err, result) {
    if (err) {
      callback(err)
    }
    else {
      callback(null, result);
    }
  })
}

restaurantSchema.virtual('averageRating').get(function() {
  console.log(this, this.toObject().totalScore, this.reviewCount, this.closingTime)
  return this.toObject().totalScore/this.toObject().reviewCount;
})

//restaurantSchema.methods.stars = function(callback){
//
//}
var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
//var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  //Review: Review,
  Follow: Follow
};
