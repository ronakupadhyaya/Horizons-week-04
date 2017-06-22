"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {

};
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
},userSchemaOptions

);

var userAgeVirtual = userSchema.virtual('age');

userAgeVirtual.get(function(){
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});
// userAgeVirtual.set(function(age){
//
// })

userSchema.methods.toggleGender = function(){
  if(this.gender === 'female'){
    return this.gender = 'male'
  }
    return this.gender = 'female'
}
userSchema.statics.findByName = function(personName, callback){
  this.find({'name.first': personName}, callback)
}
var User = mongoose.model('User', userSchema);

module.exports = User;
