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

ageVirtual.get(function() {
  // helper to get age from birthday
  function getAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  return getAge(this.birthday);
});

userSchema.methods.toggleGender = function() {
  if (this.gender === "male") {this.gender = "female";}
  else {this.gender = "male";}
}

// userSchema.statics.findByName = function(name, cb) {
//   this.find({name: name}, cb);
// }

userSchema.static('findByName', function(name, callback) {
  this.find({"name.first": name}, callback);
})


var User = mongoose.model('User', userSchema);

module.exports = User;
