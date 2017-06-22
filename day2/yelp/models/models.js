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
  displayName:{
    type: String,
    required: false
  },
  location:{
    type: String,
    required: false
  }
});

userSchema.methods.getFollows = function (callback){
  var self = this;

  Follow.find({from:self._id}).populate('to').exec(function(err, following){
    if(err){
      console.log('error in retrieving following');
      callback(err);
    }
    else {
      var followingReal = following;
      Follow.find({to: self._id}).populate('from').exec(function (err, followers) {
        if (err) {
          console.log('error in retrieving followers');
          callback(err);
        }
        else {
          console.log('before',followingReal, followers);
          callback(followingReal, followers);
        }
      })
    }
  });
};

userSchema.methods.follow = function (idToFollow, callback){
  Follow.findOne({from:this._id, to:idToFollow}, (function(err,follow){
    if(err){
      console.log('Error in follow method');
      callback(err);
    }
    else{
      if (!follow){
        var follower = new Follow({
          from: this._id,
          to: idToFollow
        });
        follower.save(callback)

      }
      else{
        throw ('You are already following this user');
      }
    }
  }).bind(this))
};

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from:this.id, to:idToUnfollow}, (function(err,follow){
    if(err){
      console.log('Error in unfollow method');
      callback(err)
    }
    else{
      callback(null,follow)
    }
  }).bind(this))
};

userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({from:this._id, to:id}, function(err, follow){
    if(err){
      console.log('error in isFollowing');
      callback(err)
    }
    else{
      console.log('again', follow, !!follow);
      callback(follow);
    }
  })
};

var FollowsSchema = mongoose.Schema({
  from:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  category:{
    type: String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  latitude:{
    type: Number,
    required:true
  },
  longitude:{
    type: Number,
    required:true
  },
  openTime:{
    type:Number,
    required:true
  },
  closeTime:{
    type:Number,
    required:true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow =  mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
