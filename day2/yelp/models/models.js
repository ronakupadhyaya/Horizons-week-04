var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    
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
    
  }
  
});




userSchema.methods.getFollows = function (id, callback){
  // find following
  Follow.find({uid1:id}).populate('uid2').exec(function(err, following){
   // find followers 
    Follow.find({uid2:id}).populate('uid1').exec(function(err,followers){
      callback(err, followers, following)
    })
  })
}

// uid1 is from uid2 is to
userSchema.methods.follow = function (idTofollow, callback){
  Follow.find({uid1: this._id, uid2: idTofollow},function(err,follows){
    if(err){
      return next(err)
    };
    if(follows.length <=0){
      var follow = new Follow ({
        uid1 : uid1,
        uid2 : uid2
      });
      follow.save(callback)
    }
    else{
      callback(null);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({uid1: this._id, uid2: idToUnfollow}.remove(function(err){
    callback(err)
  }))
}

var FollowsSchema = mongoose.Schema({
  uid1 : { type: mongoose.Schema.ObjectId, ref: 'User' },
  uid2 : { type: mongoose.Schema.ObjectId, ref: 'User' },
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

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
