//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
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
  var message = req.body.Body;
  var sender = req.body.From;
  if(message === 'nihar'){
    client.messages.create({
      body: 'Over the horizons',
      to: sender,
      from: '+14156306147'
    }, function(err, message){
      if(err){
        console.log("ERR", err);
        res.send(err);
      } else{
        process.stdout.write(message.sid);
      }

    })
  } else{
    client.messages.create({
      body: "I don't understand",
      to: sender,
      from: '+14156306147'
    }, function(err, message){
      if(err){
        console.log("err", err);
        res.send(err);
      } else{
        process.stdout.write(message.sid);
      }

    })
  }

})
//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
