var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
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
  location: String
});

userSchema.methods.getFollows = function(callback){
    Follow.find({to: this._id})
    .populate('to')
    .populate('from')
    .exec(function(err, followers) {
        if (err) {
            console.log("Error!"+err);
        }
        else {
            Follow.find({from: this._id})
            .populate('to')
            .populate('from')
            .exec(function(err, following) {
                if (err) {
                    console.log("Error!"+err);
                }
                else {
                    callback(followers, following)
                }
            })

        }
    })
}

userSchema.methods.follow = function (idToFollow, callback){
    var userId = this._id;
    Follow.findOne({to: idToFollow}, function(err, followed) {
        if (!followed) {
            var newFollower = new Follow({
                from: userId,
                to: idToFollow
            }).save(callback)
        }
    })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
    var userId = this._id;
    Follow.remove({to: idToUnfollow, from: userId}, function(err) {
        if (err) {
            console.log(err);
        } else {
            callback();
        }
    })
}

userSchema.methods.isFollowing = function(profileId, callback) {
    var userId = this._id;
    Follow.findOne({to: profileId, from: userId}, function(err, follow) {
        if(err) {
            console.log(err);
        }
        else if (!follow) {
            callback(false)
        }
        else {
            callback(true)
        }
    })
}

var followsSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

var reviewSchema = mongoose.Schema({
    content: String,
    stars: Number,
    restoId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
});

var restaurantSchema = mongoose.Schema({
    restoName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    price: {
        type: Number,
    },
    openTime: {
        type: Number,
    },
    closeTime: {
        type: Number,
    },

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', followsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
