"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {
  toJSON:{
    virtuals:true
  }
}

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
}, userSchemaOptions
)

/*
add a static called findByName to the User schema

findByName should take a String name argument and a callback function,
and should find all users with that first name then call the callback function with error, users.
*/

userSchema.static.findByName = function(name, callback) {
  return this.find({"name.first": name}, callback);
}
userSchema.methods.toggleGender = function() {
  if(this.gender === 'male') {
      this.gender === 'female';
  } else {
     this.gender ==='male';
  }
}

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var ageVirtual = userSchema.virtual('age');
ageVirtual.get(function(){
  return getAge(this.birthday);
})



ageVirtual.set(function(birthday){
  return getAge(birthday);
})


var User = mongoose.model('User', userSchema);

module.exports = User;
