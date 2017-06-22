"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// var userAgeVirtual = {
//   toJson: {
//     virtuals:true
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

var userAgeVirtual = userSchema.virtual('age');

userAgeVirtual.get(function(birthday){
  var ageMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

userSchema.statics.getByFirstName = function(name, callback){
  this.find({"name.first": name}, callback)
}

userSchema.methods.toggleGender = function() {
  if(this.gender === 'male') {
    this.gender = 'female';
  }
  else if(this.gender === 'female') {
    this.gender = 'male';
  }
}

var User = mongoose.model('User', userSchema);


module.exports = User;
