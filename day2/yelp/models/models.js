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
    type: String,
    required: true
  },
  location:{
    type: String,
    required: false
  }
});

userSchema.methods.getFollows = function (id, callback){
  //user following
  var followings;
  Follow.find({from:id})
  .populate('User')
  .exec(function(err,users){
    followings = users;
  });
  var followers;
  //user's followers
  Follow.find({to: id})
  .populate("User")
  .exec(function(err,users){
    followers = users;
  });
  callback(followers,followings);
}

userSchema.methods.follow = function (idToFollow,callback){
  var usr = this;
  this.isfollowing(idToFollow,function(status){
    if(status){callback("already following!")}
    else {
      var f = new Follow({
        from: usr._id,
        to: idToFollow
      })
      f.save();
      callback("followed successfully!")
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from:this._id, to:idToUnfollow},function(err,follow){
    if(follow.length === 0){callback("haven't following yet")}
    else {
      callback("unfollowed successfully!")}
  })
}

userSchema.methods.isfollowing = function(id,callback){
  Follow.find({from: this._id, to:id},function(err,user){
    if(user.length===0){
      callback(false);
    } else { callback(true) }
  })
}

userSchema.methods.getReviews = function(callback){
  Review.find({userid:this._id})
  .populate('Restaurant')
  .exec(callback)
}
  //  End of User Schema
var followSchema = mongoose.Schema({
  from:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  to:{
      type: mongoose.Schema.ObjectId,
      ref:'User'
  }
});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restaurantid: {
    type: mongoose.Schema.ObjectId,
    ref:'Restaurant'
  },
  userid: {
    type: mongoose.Schema.ObjectId,
    ref:'User'
  }
});

var restaurantSchemaOptions = ({
  toJSON:{
    virtuals:true
  }
})

var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closeTime: Number
},restaurantSchemaOptions);

var restaurantVirtual = restaurantSchema.virtual('averageRating');
restaurantVirtual.get(function(){
  return
})

restaurantSchema.methods.getReviews = function (callback){
  Review.find({restaurantid: this._id})
  .populate('User')
  .exec(callback);
}

restaurantSchema.methods.stars = function(callback){

}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
