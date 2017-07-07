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

var ageVirtual = userSchema.virtual('age');

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

ageVirtual.get(function() {
  return Math.floor(getAge(this.birthday))
})

userSchema.methods.toggleGender = function() {
  if (this.gender === "male") {
    this.gender = "female"
  } else {
    this.gender = "male"
  }
}

userSchema.static('findByName', function(name, callback) {
  User.find({'name.first': name}, callback)
})

var User = mongoose.model('User', userSchema);



module.exports = User;
