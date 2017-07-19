var mongoose = require("mongoose");
var connect = require("./connect.js");

mongoose.connect(connect);

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model("User", UserSchema);

module.exports = {
  User: User
};
