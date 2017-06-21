var mongoose = require('mongoose');
// var Schema = mngoose.Schema;
// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({ // users schema
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  location: String
});
var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var RestaurantSchema = mongoose.Schema({
  name: String,
  category: [
    "Korean", "Barbeque", "Casual"
  ],
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closeTime: Number,
  address: String
})


userSchema.methods.getFollows = function(id, callback) {

  Follow.find({
      to: id,
    })
    .populate('from')
    .exec(function(err, followers) {
      if (err) callback('error');
      else {
        Follow.find({
            from: id
          })
          .populate('to')
          .exec(function(error, following) {
            if (error) callback('error');
            else {

              callback(null, followers, following);
            }
          })
      }
    });
}
userSchema.methods.follow = function(idToFollow, callback) {
  var allThis = this;
  allThis.isFollowing(idToFollow, function(err, result) {
    if (err) callback('error');
    else {
      console.log(result);
      if (result === false) {
        var newFollow = new Follow({
          to: idToFollow,
          from: allThis.id
        })
        callback(null, newFollow);
      } else {
        callback(null, true);
      }
    }
  })

}



userSchema.methods.unfollow = function(idToUnfollow, callback) {
  var allThis = this;

  Follow.remove({
    'to': idToUnfollow,
    'from': allThis._id
  }, callback);
}
userSchema.methods.isFollowing = function(id, callback) {
  var fromId = this._id;
  // console.log(fromId);
  Follow.findOne({
      from: fromId
    },
    function(err, target) {
      if (err) callback('error');
      else {

        if (target === null) callback(null, false);
        else {
          var toId = target.to;

          if (JSON.stringify(id) === JSON.stringify(toId)) {
            callback(null, true);
          } else {
            callback(null, false);
          }

        }
      }
    })
}





var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function(restaurantId, callback) {

}

//restaurantSchema.methods.stars = function(callback){
//
//}


var User = mongoose.model('User', userSchema);
var Follow = mongoose.model('Follow', followSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
