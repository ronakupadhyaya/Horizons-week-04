"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {
  toJSON: {
    virtuals: true
  }
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
  }, userSchemaOptions
});

userSchema.statics.findByName = function(name, callback) {
  this.find({'name.first': name}, callback);
}
// userSchema.static('findByName', function(age, callback){
//   this.find({name: name}, callback);
// })

userSchema.methods.toggleGender = function() {
  if (this.gender === 'male') {
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
}


var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})
// ageVirtual.set(function(age) {
//   var dayOfBirth = Date.now() - age;
//   this.birthday = 3;
// })



var User = mongoose.model('User', userSchema);

module.exports = User;
