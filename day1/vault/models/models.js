var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var User = mongoose.model('User', {
  username: String,
  hashedPassword: String,
  _id: Number
});

module.exports = {
  User: User
};
