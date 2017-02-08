var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	hashedPassword: String,
});

module.exports = {
	User: mongoose.model('User', UserSchema)
};