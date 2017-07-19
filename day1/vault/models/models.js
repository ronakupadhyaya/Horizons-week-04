var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model("User", UserSchema);

module.exports = {
  User: User
};
