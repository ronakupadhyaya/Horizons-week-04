var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  username:String,
  password:String,
  phone:String
})

var Message = mongoose.model('Message',messageSchema)

module.exports={
  Message:Message
}
