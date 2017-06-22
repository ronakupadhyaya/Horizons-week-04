var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true},
  email: {
    type: String,
    required: true},
  password: {
    type: String,
    required: true},
  location: String
});

var FollowsSchema = mongoose.Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  restaurant: {
    type: Schema.ObjectId,
    ref: 'Restaurant'
  },
  content: {
    type: String,
  },
  stars: {
    type:Number
  }
});

var restaurantSchemaOptions = {
  toJSON: {
    virtuals: true
  }
};
var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: Number,
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  openTime: {
    type: Date,
    required: true
  },
  closingTime: {
    type: Date,
    required: true
  },
  totalScore: Number,
  reviewCount: Number
  // virtuals for totalScore and reviewCount
}, restaurantSchemaOptions);

var avgRatingVirtual = restaurantSchema.virtual('averageRating');

avgRatingVirtual.get(function(){
 return this.totalScore/this.reviewCount;
})

userSchema.methods.getFollows = function (callback){
  var self =this._id;
   Follow.find({to:self}).populate('from').exec(function(err,allFollowers){
     if(err){
       callback(err);
     } else {
       Follow.find({from:self}).populate('to').exec(function(err,allFollowing){
         if(err){
           callback(err);
         } else {
           callback(null,allFollowers,allFollowing)
         }
       })
     }
   })
}
userSchema.methods.follow = function (idToFollow, callback){
  var self = this._id;
 Follow.findOne({from:self,to:idToFollow},function(err,theFollow){
   console.log("hello in follow");
   console.log(err);
   console.log(theFollow);
   if (err) {
     callback(err)
   } else if (theFollow){
     callback(new Error("That follow already exists!"))
   } else {
     var newFollow = new Follow ({
       from: self,
       to: idToFollow
     });
     // newFollow.save(function(err,result){
     //   if(err){
     //     callback(err);
     //   } else {
     //     callback(null,result);
     //   }
     // });   this is the same thing as the following line
     console.log("new Fellow",newFollow)
     newFollow.save(callback);
   }
 })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
 Follow.deleteOne({from: this._id, to:idToUnfollow},callback);
}

userSchema.methods.isfollowing = function(id, callback) {
  var found = Follow.find({to:id,from:this._id});
  if (found){
    callback(null,true);
  } else {
    callback(null,false)
  }
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){
 Review.findById(restaurantId,callback);
}

//restaurantSchema.methods.stars = function(callback){
//
//}
var User =mongoose.model('User', userSchema);
var Restaurant=mongoose.model('Restaurant', restaurantSchema);
var Review=mongoose.model('Review', reviewSchema);
var Follow=mongoose.model('Follow', FollowsSchema);

module.exports = {
  User:User,
  Restaurant:Restaurant,
  Review:Review,
  Follow:Follow
};
