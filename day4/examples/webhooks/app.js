//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
// var Player = require('./models.js').Player;

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)

//setup application configs
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE

app.post('/handletext', function(req, res) {
  console.log(req.body)

  if (req.body.Body.toLowerCase() === "trust the process") {
    client.messages.create({
      to: req.body.From,
      from: "+16508259098",
      body: "You got the right idea",
      mediaUrl: "http://cdnph.upi.com/svc/sv/i/3981497907447/2017/1/14979075962468/Boston-Celtics-Philadelphia-76ers-officially-finalize-deal-to-swap-top-2017-NBA-draft-picks.jpg",
    }, function(err, message) {
      console.log(message.sid);
    });
  } else {
    client.messages.create({
      to: req.body.From,
      from: "+16508259098",
      body: "No no no...try again",
      mediaUrl: "http://media.philly.com/images/062713_hinkie-sam_600.jpg",
    }, function(err, message) {
      console.log(message.sid);
    });
  }
  res.end()
})

//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
