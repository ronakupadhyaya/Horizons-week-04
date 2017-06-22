var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: { //could be first name, last name, nickname
    type: String, 
    required: true
  },
  email: { // email
    type: String,
    required: true
  },
  password: { //hashed password used for authentication
    type: String,
    required: true
  },
  location: { //descriptive location for a User
    type: String
  }
});

userSchema.methods.getFollows = function (callback){

  var myId = this._id;
  //from: this._id --> id of people user is following
  Follow.find({from: myId}).populate('to').exec(function(err,allFollowing){
    if (err){
      console.log(err);
    } else{
      //to: this._id --> id of follower
      Follow.find({to: myId}).populate('from').exec(function(err, allFollowers){
        if (err){
          console.log(err);
        } else{
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }
  })
}



userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id;
  Follow.findOne({from: fromId, to: idToFollow}, function(err, theFollow){
    if (err){
      callback(err);
    } else if (theFollow){
      callback(new Error("That follow already exists!"));
    }else{
      var followObj = new Follow({
        from: idToFollow,
        to: fromId
      })
      followObj.save(callback);
    }
  })

  
  // followObj.save(function(err,result){
  //     if (err){
  //       callback(err);
  //     } else{
  //       callback(null,result)
  //     }
  //     callback(err,result)
  // })
}

// User.findById('asdfa', function(err, user) {
// User.unfollow('james', function(err, result) {



userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, 
                 to: idToUnfollow})
        .exec(callback)
}

var followsSchema = new mongoose.Schema({
  from: {
    //"5efjadksf2"
    type: mongoose.Schema.ObjectId, //id of user follow another
    ref: 'User'
  }, 
  to: {
    type: mongoose.Schema.ObjectId, // if of user being followed
    ref: 'User'
  }
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

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followsSchema)
module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', followsSchema)
};
