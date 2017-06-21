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

var age = userSchema.virtual('age'); // create virtual

age.get(function() {
  return getAge(this.birthday);
})

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
userSchema.method('toggleGender', function() { //// create method
  if (this.gender === 'male') this.gender = 'female';
  else this.gender = 'male';
})
userSchema.static('getByFirstName', function(firstName, cb) { // create static
  this.find({
    'name.first': firstName
  }, cb);
})
var User = mongoose.model('User', userSchema);
module.exports = User;
