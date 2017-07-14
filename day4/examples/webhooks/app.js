//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)

var Message = require('./models.js').Message;

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main.handlebars'}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE
// app.get('/', function(req, res) {
//   console.log('test');
//   Message.find(function(err, messages) {
//     console.log(err);
//     console.log(messages);
//     res.render('viewmessages', {
//       messages: messages
//     })
//   })
// })

app.post('/handletext', function(req, res) {
  console.log(req.body);
  res.end()
})
// add a route that will respond to post requests sent by Twilio via
// webhooks
// app.post('/twilio', function(req, res) {
//   var newMessage = new Message({
//     from: req.body.From,
//     body: req.body.Body
//   })
//   newMessage.save(function(){
//     res.end()
//   })
// })
//start up our server
var port = process.env.PORT || '3000'
console.log(port);

app.listen(port)
console.log('server is up')
