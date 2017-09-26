"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {
  toJSON:{
    virtuals: true
  }
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
}, userSchemaOptions);
var userAgeVirtual = userSchema.virtual('age');

userAgeVirtual.get(function(){
  return Math.abs((new Date(this.birthday - new Date())).getUTCFullYear()-1970);
})
userSchema.methods.toggleGender = function(){
  if(this.gender === 'male'){
    this.gender = 'female';
  }else{
    this.gender = 'male';
  }
}
userSchema.statics.findByName = function(name, cb){
  this.find({'name.first': name}, cb);
}
var User = mongoose.model('User', userSchema);

module.exports = User;
