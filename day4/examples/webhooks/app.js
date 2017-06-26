//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

//setup mongoose connection
mongoose.connection.on('error', function(){
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function(){
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE
app.post('/handletext', function(req, res){
  console.log(req.body);
  // console.log("testing");
  if(req.body.Body === "nihar"){
    var newMessage = client.messages.create({
     to: req.body.From,
     from: req.body.To,
     body: "its me coming on up over the horizons",
   })
  }
  else {
    var newMessage = client.messages.create({
     to: req.body.From,
     from: req.body.To,
     body: "no comprendo señor",
   })
  }
  res.send(newMessage);
})

//add a route that will respond to post requests sent by Twilio via
//webhooks

// app.post('/replytext', function(req, res){
//
// })
//
// app.post('/replytext', function(req, res){
//   var newMessage = client.messages.create({
//    to: req.body.from,
//    from: req.body.to,
//    body: "don't talk to me or my son ever again",
//  })
// })


//start up our server
var port = process.env.PORT || 3000

app.listen(port)
