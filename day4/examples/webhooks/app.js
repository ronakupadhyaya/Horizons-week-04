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

app.post ('/handletext', function(req,res){
  client.messages.create({
  to: "+19178644155",
  from: "+13478307886",
  body: "HELLO THERE",
}, function(err ,message){
  if(!err) {
    res.send();
  }
})
  //
  // console.log(req.body);
  // res.end();
})
//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
