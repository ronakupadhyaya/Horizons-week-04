"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var userSchemaOptions ={
//   toJSON: {
//     virtuals: true
//   }
// }

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

var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function() {
  return getAge(this.birthday)
})

ageVirtual.set(function(newBirthday) {
  return getAge(newBirthday)
})

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

userSchema.methods.toggleGender = function() {
  if (this.gender === 'male') {
    this.gender = 'female'
    return this.gender
  }
  if (this.gender === 'female') {
    this.gender = 'male'
    return this.gender
  }
}

userSchema.statics.getByFirstName = function(name, callback) {
  this.find({"name.first": name}, callback)
}

var User = mongoose.model('User', userSchema);

module.exports = User;
