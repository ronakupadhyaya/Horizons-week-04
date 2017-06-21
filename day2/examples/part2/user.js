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
},{
  toJSON:{
    virtuals:true
  }
});

var age = userSchema.virtual('age');
age.get(function() {
  function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }; 
  return calculateAge(this.birthday);
})

userSchema.method('toggleGender', function() {
  if (this.gender === 'male') {
    this.gender = 'female';
    //return this;
  }
  else if (this.gender === 'female') {
    this.gender = 'male';
    //return this;
  }
})

userSchema.statics.findByName = function(name, callback) {
  User.find({'name.first': name}, function(err, users) {
    return callback(err, users);
  })
}

var User = mongoose.model('User', userSchema);

module.exports = User;
