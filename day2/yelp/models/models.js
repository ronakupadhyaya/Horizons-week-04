var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName:String,

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location:String
});

revSchemaOptions={
  toJSON:{
    virtuals:true
  }

}

var reviewSchema = mongoose.Schema({
  content:String,
  stars:Number,
  restaurantId:{
    type:mongoose.Schema.ObjectId,
    ref:'Restaurant'
  },
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }

},
revSchemaOptions

);

var restaurantSchema = mongoose.Schema({
  name:String,
  category:String,
  latitude:Number,
  longitude:Number,
  relativePrice:Number,
  openTime:Number,
  closeTime:Number,
  totalScore:Number,
  reviewCount:Number

});

userSchema.methods.getFollows = function (callback){
  var myId=this._id;
  Follow.find({follower:myId})
  .populate('leader')
  .exec(function(err, following){
    if(err){
      callback(err);
    }else{
      Follow.find({leader:myId})
      .populate('follower')
      .exec(function(err,followers){
        if(err){
          callback(err);
        }else{
          callback(null,{followers:followers,following:following})
        }
      })
    }

  })

}


userSchema.methods.isFollowing=function(idFollowing,callback){
  var followerId=this._id;
  Follow.findOne({follower:followerId,leader:idFollowing}, function(err, theFollow){

    if(err){
      callback(err);
    }else if(theFolow){
      callback(null,{result:true});
    }else{
      callback(null,{result:false});
    }
  })


}
userSchema.methods.follow = function (idToFollow, callback){
  var followerId=this._id;


  Follow.find({follower:followerId,leader:idToFollow}, function(err, theFollow){

    if(err){
      callback(err)
    }else if(theFolow){
      callback(new Error('The follow exists'))
    }else{
      var newFollow= new Follow({
        leader:idToFollow,
        follower:followerId
      });
      newFollow.save(function(err,result){
        if(err){
          callback(err);
        }else{
          callback(null,result);
        }
      });


    }
  })

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({leader:idToUnfollow,follower:this._id},function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result);
    }
  })

}

restaurantSchema.methods.getReviews=function(callback){
  Review.find({restaurantId:this._id})
  .populate('userId')
  .exec(function(err, rev){
    if(err){
      callback(err)
    }else{
      callback(null,rev)
    }

  })

}



userSchema.methods.getReviews=function(callback){
  Review.find({userId:this._id})
  .populate('restaurantId')
  .exec(function(err, rev){
    if(err){
      callback(err)
    }else{
      callback(null,rev)
    }

  })

}

var ratingVirtual=reviewSchema.virtual('averageRating');

ratingVirtual.get(function(){

        var rating=this.totalScore/this.reviewCount;
        var aveRating=(Math.round(rating * 2) / 2).toFixed(1);
        return aveRating;

});

var FollowsSchema = mongoose.Schema({
  follower:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  leader:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }

});







//restaurantSchema.methods.stars = function(callback){
//
//}
var User=mongoose.model('User', userSchema);
var Restaurant=mongoose.model('Restaurant', restaurantSchema);
var Review=mongoose.model('Review', reviewSchema);
var Follow=mongoose.model('Follow', FollowsSchema);

module.exports = {
  User:User,
  Restaurant:Restaurant ,
  Review:Review,
  Follow:Follow
};
