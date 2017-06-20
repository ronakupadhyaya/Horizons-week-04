var mongoose = require('mongoose');

var User = mongoose.model('User', { /// 'user' is the same as the name on the database
  username: String,
  password: String
})

module.exports = {
  User: User,
}
// mongoose.connect(process.env.MONGODB_URI);
