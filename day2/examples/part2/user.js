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

var ageVirtual=userSchema.virtual("age")

ageVirtual.get(function() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

userSchema.method('toggleGender' ,function(){
  this.gender==="male"? this.gender="female":this.gender="male"

})
 userSchema.statics.getByFirstName=function(firstname,callback){
   this.find({'name.first':firstname},callback);
 }

var User = mongoose.model('User', userSchema);

module.exports = User;
