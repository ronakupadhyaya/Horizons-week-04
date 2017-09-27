"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function getAge(birthday) {
  console.log(birthday);
  console.log(typeof birthday);
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

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

userSchema
.virtual('age')
.get(function () {
  return getAge(this.birthday);
});



// userSchema.methods('gender', function() {
//   if(this.gender === 'male') {
//     return 'female'
//   }
//   return 'male'
// })

var User = mongoose.model('User', userSchema);

module.exports = User;
