//WEBHOOK APP.JS
//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
var Message = require('./models').Message;
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


//setup mongoose connection
mongoose.connection.on('error', function(){
  console.log('error connecting to database')
});
mongoose.connection.on('connected', function(){
  console.log('succesfully connected to database')
});
mongoose.connect(process.env.MONGODB_URI)

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//ROUTES
app.get('/', function(req, res) {
  Message.find(function(err, messages) {
    res.render('viewmessages', {
      messages: messages
    })
  })
});

//when twillio has data to send, posts it to this link
// we create message mongodb and send status 200 back to twilio
app.post('/twilio', function(req, res) {
  console.log('reaches try message send');
  var newMessage = new Message({
    from: req.body.From,
    body: req.body.Body
  });

  var body = req.body.Body;
  // var sendBody = (body === "Nihar") ? "Over the horizons" : "No entiendo";
  var sendBody = `Hey Sam! It's Amanda :). We've been coding a texting app
                  thing that receives and sends texts via an online number
                  and so I thought I might as well check in! Hope your summer
                  is going great and that tutoring and hospitals aren't keeping
                  ya too busy! talk soon :)`;
  console.log('reaches before message send');
  client.messages.create({
    to: "+17025411678",
    from: "+17028198723",
    body: sendBody
  });
  console.log('reaches after message send');
  newMessage.save(function() {
    res.status(200).end();
  });
});

// app.post('/handletext', function(req, res) {
//   //log req.body
//   //send response w/ status 200
// })

//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
