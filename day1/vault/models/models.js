"use strict";

// Project model
var mongoose = require('mongoose');


var User = mongoose.model('User', {
  username: {
    type: String
  },
  password: {
    type: String
  }
});


module.exports = {
  User : User
}
