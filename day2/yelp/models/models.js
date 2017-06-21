var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
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
    type: String,
    required: true
  }
});


userSchema.methods.getFollows = function (id, callback){
  var self = this;
  Follow.find({'from':self._id})
        .populate('to')
        .exec(function(err,allfollowing){
    Follow.find({'to':self._id})
          .populate('from')
          .exec(function(err,allfollowers){
      callback(allfollowers, allfollowing);
    });
  });
};

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.find({from:self._id ,to: idToFollow},function(err,item){
    if(item.length===0){
      var folw = new Follow({from: self._id, to: idToFollow});
      folw.save(function(err){
        Follow.find({'from':self._id})
              .populate('to')
              .exec(function(err,allfollowing){
          Follow.find({'to':self._id})
                .populate('from')
                .exec(function(err,allfollowers){
            callback(allfollowers, allfollowing);
          });
        });
      });
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  Follow.remove({"from": self._id, "to": idToUnfollow},function(err){
    Follow.find({'from':self._id})
          .populate('to')
          .exec(function(err,allfollowers){
      Follow.find({'to':self._id})
            .populate('from')
            .exec(function(err,allfollowing){
        callback(allfollowers, allfollowing);
      });
    })
  });
};

userSchema.methods.isFollowing = function(idFollowed,callback){
  Follow.find({'from':this._id, 'to':idFollowed})
        .exec(function(err,answer){
          callback(answer.length!==0);
        })
};

var followSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: Number,
  longitude: Number,
  openTime: Number,
  closingTime: Number,
  totalScore: {
    type: Number,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  }
});

var averageRatingVirtual = restaurantSchema.virtual('averageRating');
averageRatingVirtual.get(function(){
  return this.totalScore/this.reviewCount;
})

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', followSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
