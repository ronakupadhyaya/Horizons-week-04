"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchemaOptions = {};
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
}, userSchemaOptions);

var virtualAge = userSchema.virtual('age');

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
virtualAge.get(function(){
  return getAge(this.birthday);
})

userSchema.methods.toggleGender = function(){
  return ((this.gender==='male') ? this.gender ="female":this.gender ="male");
  console.log(this.gender)
}

userSchema.statics.getByFirstName = function(name,callback){
  this.find({'name.first':name},callback)
}

var User = mongoose.model('User', userSchema);

module.exports = User;
