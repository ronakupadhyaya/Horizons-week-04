var mongoose = require('mongoose')
var Schema = mongoose.Schema

var noteSchema = new Schema({
  from: String,
  content: String
})

var Note = mongoose.model('Note', noteSchema)

module.exports = {
  Note:Note
}
