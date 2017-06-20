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
  toObject: {virtuals: true},
  toJSON:{
    virtuals:true
  }
});

var AgeVirtual = userSchema.virtual('age')

AgeVirtual.get(function(birthday){
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

userSchema.methods.toggleGender = function(){
  if(this.gender === 'male'){
    this.gender = 'female'
  }else if(this.gender === 'female'){
    this.gender = 'male'
  }
}

userSchema.statics.findByName= function(name, callback){
  this.find({"name.first": name}, callback)
}


var User = mongoose.model('User', userSchema);
module.exports = User;
