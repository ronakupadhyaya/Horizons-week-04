var mongoose = require('mongoose');

mongoose.connect(require('./connect'))

var Schema = mongoose.Schema;
var User = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('userEncrypt', User);