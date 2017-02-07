var mongoose = require('mongoose');

// Create all of your models/schemas here, as properties.
var User = mongoose.model('User',{
  username: String,
  password: String
});

module.exports = User;