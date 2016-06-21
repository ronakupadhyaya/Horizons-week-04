// YOUR CODE HERE

var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);
module.exports = {
  User: mongoose.model('User', {
    user: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }

  })
}
