//create messageSchema, export message model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  from: String,
  body: String
});

var Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message: Message
}
