var mongoose = require('mongoose')
mongoose.connect(require('./connect'))


var userCredentials = mongoose.Schema({
  username: String,
  password: String
});



module.exports = {
  User: mongoose.model('User', userCredentials)
};
