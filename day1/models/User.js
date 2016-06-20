var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    cookie: String,
    money: { type: Number, default: 100 }
});

module.exports = mongoose.model('User', UserSchema);
