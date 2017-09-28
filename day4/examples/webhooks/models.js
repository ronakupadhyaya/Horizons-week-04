var mongoose = require('mongoose');


var messageSchema = mongoose.Schema({
  to: String,
  from: String,
  body: String
})
