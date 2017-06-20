var mongoose = require('mongoose');
// mongoose.connection.on('connected', function() {
//   console.log('Connected to MongoDb!');
// })
// mongoose.connect('mongodb://tiffany:password@ds131492.mlab.com:31492/vault-tiffany');

var User = mongoose.model('User', {
  username: String,
  hashPassword: String
})






























module.exports = {
  User: User
}
