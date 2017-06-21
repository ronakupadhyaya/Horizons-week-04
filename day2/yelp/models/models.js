var mongoose = require(‘mongoose’);
var User = mongoose.model(‘User’, userSchema)
var Restaurant = mongoose.model(‘Restaurant’, restaurantSchema)
var Review = mongoose.model(‘Review’, reviewSchema)
var Follow = mongoose.model(‘Follow’, followSchema)

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require(‘./connect’);
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
 displayName: {
   type: String,
   required: true
 },
 location: {
   type: String
 }
});

var followSchema = mongoose.Schema({
 from: {
   type: mongoose.Schema.ObjectId,
   ref: ‘User’
 },
 // ************ the mongoose.schema.object id is an actual value that you canunfollow



 //access that is the old database id of the user being imported
 to: {
   type: mongoose.Schema.ObjectId,
   ref: ‘User’
 },
});


//don't need the ID here since calling it on the user anyway
//if it was a static method would need a callback--things called on a single user
//would be a method, things called on user collection as whole are static
//methods and so then you would need an ID. Save
userSchema.methods.getFollows = function (callback){
  var fromId=this._id
  Follow.find({from: fromId })
  .populate('to')
  .exec(function(err,allFollowing){

    if(err){
      callback(err)
    } else{
        Follow.find({to:myID})
        .populate('from')
        .exec(function(err, allFollowers){
          //!!that err overwrites the other err in a process called shadowing
          if(err){
            callback(err)
          } else{
            callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
          }
        })
      })
    }
  })
}
// before code along
  //  var allFollowers = [];
  //  var allFollowing = [];
  //
  //  // id is the user you want to find following and followers for
  //  followsSchema.find({“_id”: id}, function(err, follow) {
  //    callback(follow)
  //    return {[allFollowers], [allFollowing]}
  //
  //  }) // callback is filled when called
  //  // populate later
  // }

userSchema.methods.follow = function (idToFollow, callback){
//a static method would need to take both ID's


  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
    var fromId=this._id
    //whenever use this and have a callback have to do this
    if(err{
      callback(err)
    }else if(theFollow{
      callback(new Error("that follow already exists"))
    }
    else{
      var newFollow=new Follow({
        to: idToFollow,
        from: fromId

      });
      newFollow.save(function(err, result){
        if(err){
          callback(err);
          //!!making assumption that person giving callback function had err as a
          // !!parameter (in this case it's us)
        } else{
            callback(null, result);
        }

        // !!can also just do
        // !!  callback(err, result)
        //!!AND can also just do newFollow.save(callback);
          //!but above is more clear so just doing that

        //!!callback is just the function name that you call in



    });
  })
  //****  before code along
     // followsSchema.find({“_id”: id}, function){
     //
     // }
     // var newFollowRelationship = new followsSchema {
     //   from: this._id,
     //   to: idToFollow
     // }
     //

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this._id}, function(err, result){
    if(err){
      callback(err)

    } else{
      callback(null, result);
      //!!any callback function you give mongoose will be called with err, result so that's why we do this null, result thing
      //!!but can also change that, but it's what we were doing before when didn't control database and it's also a good practice
    }
  });
}
//
// var FollowsSchema = mongoose.Schema({
//
// });

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
 User: User,
 Restaurant: Restaurant,
 Review: Review,
 Follow: Follow
};
