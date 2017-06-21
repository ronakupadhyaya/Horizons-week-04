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
  name: {
    type: String
    // required: true
  },
  location: String
});

userSchema.methods.getFollows = function (callback){
  //find followers and followed and pass into callback(fer,fed)
  var self = this;
  Follow.find({to: self._id}).populate('from').exec(function(err, followers){
    Follow.find({from: self._id}).populate('to').exec(function(err, following){
      callback(followers, following);
    })
  })
}

userSchema.methods.follow = function (idToFollow, callback){
    var follow = new Follow({
      from: this._id,
      to: idToFollow
    })

    Follow.findOne(follow, function(err, found){
      if(err){
        callback(err)
      }else if(!found){ //you didn't find a given relationship
        follow.save(function(err, f){
          if(err){
            callback(err)
          }else{
            callback(null, f)
          }
        })
      }else{
        callback(new Error("Follow already exists"))
      }
    })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){

  Follow.findOne({
    from: this._id,
    to: idToUnfollow
    },  function(err, found){
      if(err){
        callback(err)
      }else if(found){  //you found a given relationship
        found.remove(function(err){
          callback(null, found)
        });
      }else{
        callback(new Error("No follow exists"))
      }
  })

}

userSchema.methods.isFollowing = function(idToCheck, callback){
  var follow = new Follow({
    from: this._id,
    to: idToCheck
  })

  Follow.findOne(follow, function(err, found){
    if(found === undefined){
      callback(false)
    }else{
      callback(true)
    }
  })
}

var followsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId, //follower will be a document**
    ref: 'User' //document is in this collection**
  },
  to:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  rid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  open: Number,
  close: Number
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({rid:restaurantId})
        .populate('uid')
        .exec(function(err,found){
          console.log(found)
          callback(found)
        })
}

//restaurantSchema.methods.stars = function(callback){
//
//}


var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', followsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
