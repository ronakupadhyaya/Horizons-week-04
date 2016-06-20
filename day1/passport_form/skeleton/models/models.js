// YOUR CODE HERE
var mongoose = require('mongoose');

mongoose.connect("mongodb://anirudh:anilr94@ds051843.mlab.com:51843/horizons_anirudh");

var userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
