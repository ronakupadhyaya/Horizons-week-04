//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var Message = require('./models').Message;
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)
//dd
//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE
app.get('/', function(req, res) {
  Message.find(function(err, messages) {
    res.render('viewmessages', {
      messages: messages,
    })
  })
})

app.post('/handletext', function(req, res) {
  var message = new Message({
    from: req.body.From,
    body: req.body.Body
  })
  message.save(function() {
    var body = 'I don\'t understand'

    if (req.body.Body === 'Nihar')
      body = 'Over the horizons';

    client.messages.create({
      to: req.body.From,
      from: req.body.To,
      body: body,
    })
    res.end();
  })
})

//start up our server
var port = process.env.PORT || 3000

app.listen(port)