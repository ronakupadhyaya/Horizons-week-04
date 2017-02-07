var mongoose = require('mongoose');

// Create all of your models/schemas here, as properties.
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model('User',{
  username: {
    type: String,
    required: true

  },
  password: {
    type: String,
    required: true
  }
})



module.exports = {
  User: mongoose.model('User', userSchema)
};
