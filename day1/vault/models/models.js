'use strict';
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    hashedPassword: String
});
var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
}