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
  toJSON:{
    virtuals:true
  }
});

var virtualAge = userSchema.virtual('age');
virtualAge.get(function() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

userSchema.method('toggleGender', function() {
  if (this.gender === 'female') {
    this.gender = 'male';
  }
  else {
    this.gender = 'female';
  }
});

userSchema.statics.findByName = function(name, callback) {
  this.find({'name.first': name}, function(err, users) {
    callback(err, users);
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
