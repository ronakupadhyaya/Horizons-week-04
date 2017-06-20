var mongoose = require('mongoose');
mongoose.connection.on('connected',function(){
  console.log('Connected to MongoDb!');
});
mongoose.connect('mongodb://zy:zy@ds133192.mlab.com:33192/week4-1')


var userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String });
var User = mongoose.model('User', userSchema);

module.exports={
  User: User
}
