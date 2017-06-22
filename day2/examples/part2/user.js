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


var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function getAge() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

userSchema.methods.toggleGender = function(){
	if(this.gender=== 'male'){
		this.gender = 'female';
	} else{
		this.gender = 'male';
	}
}

userSchema.statics.findByName = function(name, callback){
	this.find({'name.first': name}, callback);

}

var User = mongoose.model('User', userSchema);


module.exports = User;
