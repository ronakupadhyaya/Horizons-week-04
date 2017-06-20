"use strict";

// Project model
var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: String,
  hashedPassword: String
  // YOUR CODE HERE
});

module.exports = {
  User: User
}
