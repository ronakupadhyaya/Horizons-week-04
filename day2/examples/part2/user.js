"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
}, {
  toJSON: {
    virtuals: true
  }
});
var userage = userSchema.virtual('age');
userage.get(function() {
  var bdayyr = this.birthday.getYear();
  var tdayyr = (new Date).getYear();
  return tdayyr - bdayyr
})
var toggleGender = userSchema.method('toggleGender', function() {
  this.gender = (this.gender === 'male') ? "female" : "male"
})
userSchema.statics.findByName = function(name, cb) {
  this.find({
    "name.first": name
  }, cb)
}
var User = mongoose.model('User', userSchema);

module.exports = User;
