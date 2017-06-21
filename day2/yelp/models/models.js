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
    required: false,
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

});

var restaurantSchema = new mongoose.Schema({

});

userSchema.methods.getFollows = function (callback){
  var id = this._id
  module.exports.Follow.find({'from':id})
  .populate('to')
  .exec(function(err, following){
    if(err){
      console.log('Error in getting following of user');
    }
    module.exports.Follow.find({'to':id})
    .populate('from')
    .exec(function(err, followers){
      if(err){
        console.log('Error in getting followers from user');
      }
      callback(following, followers)
    })
  })

}

userSchema.methods.follow = function (idToFollow, callback){
  //the id that the method is being called on, ie me
  var myId = this._id;
  //finding a doc that shows that i follow this id
  module.exports.Follow.find({'from': myId, 'to': idToFollow}, function(err, followDoc){
    if(err){
      console.log('Error in follow model db', err)
    }
    //if i follow show that i already follow
    if(followDoc === []){
      console.log(followDoc);
      console.log('You are already following the user')
    }
    else{
    //otherwise create a new follow doc and save it to the database
      var obj = new Follow({
        from: myId,
        to: idToFollow
      })
      obj.save(callback)
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  //find follow doc
  var id = this._id
  module.exports.Follow.find({'from':id, 'to': idToUnfollow}).remove().exec(callback)
}

userSchema.methods.isFollowing = function (idToFind, callback){
  //find follow doc
  var id = this._id
  module.exports.Follow.find({'from':idToFind, 'to': id}, function(err, followDoc){
    if(err){
      console.log('error in db for isFollowing', err)
    }
    //if there is a follower to that user return true through the callback
    console.log('isfol', followDoc)
    if(followDoc === []){
      callback(false)
    }else{
      callback(true)
    }
  })
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}
var User = mongoose.model('User', userSchema)
var Follow = mongoose.model('Follow', FollowsSchema)
var Review = mongoose.model('Review', reviewSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
