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

userSchema.methods.toggleGender = function() {
  if (this.gender === 'male') {
    return 'female'
  } else return 'male'
}

userSchema.statics.findByName

var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

ageVirtual.set(function(birthday) {

})

var User = mongoose.model('User', userSchema);

module.exports = User;
