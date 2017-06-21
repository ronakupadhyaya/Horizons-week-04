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
    type:String,
    required:true
  },
  location:{
    type:String,
    required:false
  }
});

userSchema.methods.getFollows = function (callback){
var myId=this.id;
Follow.find({user1from:myId}).populate('user2to').exec(function(err,allFollowing){
  if (err){
    callback(err)
  }
  else{
    Follow.find({user2to:myId}).populate('user1from').exec(function(err,allFollowers){
      if(err){
        callback(err)
      }
      else{
        callback(null,{allFollowers:allFollowers,allFollowing:allFollowing})
      }
    })
    }
  })
}

//
//   Follow.find({user1from:this._id},function(err,result){
//     if(err){
//       callback(null,false)
//     }
//     else{
//       callback(null,result)
//     }
//   })
// }

userSchema.methods.follow = function (idToFollow, callback){
  var fromID=this._id
    Follow.findOne({user1from:this._id,user2to:idToFollow},function(err,theFollow){
      if(err){
        callback(err)
      }
      else if(theFollow){
        callback(new Error('already exist'))
      }
      else {
        var newFollow = new Follow({
          user1from: fromID,
          user2to:idToFollow
        })
        newFollow.save(function(err) {
          if (err) {
            callback(err)
          } else {
            callback(null,result)
          }
        })
      }
    })
}

// User.findById('patrick"sid', function(err, patrick) {
//   if (err || !patrick) {
//     //..
//   } else {
//     patrick.follow('amy', function(err,result) {
//       if (result){
//         //redirect to other things
//       }
//       else{
//         //show message fail to follow
//       }
//     })
//   }
// })

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({user1from:this._id,user2to:idToFollow},function(err,result){
    if (err){
      callback(err)
    }
    else{
      callback(null,result)
    }
  })
}

var FollowsSchema = mongoose.Schema({
  user1from:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  user2to:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
});

// var reviewSchema = mongoose.Schema({
//
// });


var restaurantSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String
  },
  latitude:{
    type:Number
  },
  longitude:{
    type:Number
  },
  price:{
    type:Number
  },
  openTime:{
    type:Number
  },
  closeTime:{
    type:Number
  }
});

// restaurantSchema.methods.getReviews = function (restaurantId, callback){

//}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User',userSchema)
// var Restaurant = mongoose.model('Restaurant',Restaurants)
// var Review = mongoose.model('User',reviewSchema)
var Follow = mongoose.model('Follow',FollowsSchema)
var Restaurant = mongoose.model('Restaurant',restaurantSchema)
module.exports = {
  User: User,
  // Restaurant: mongoose.model('Restaurant', restaurantSchema),
  // Review: mongoose.model('Review', reviewSchema),
  Follow: Follow,
  Restaurant:Restaurant
};
