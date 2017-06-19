var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({ username: 'string', password: 'string' });
var User = mongoose.model('User', userSchema);

module.exports = {User: User};