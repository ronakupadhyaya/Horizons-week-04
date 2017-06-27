//require necessary modules
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
var Message = require('./models').Message
//marina
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

//add a route that will respond to post requests sent by Twilio via
//webhooks
// app.get('/', function(req,res){
//   Message.find(function(err, messages){
//     res.render('viewmessages',{
//       messages:messages
//     })
//   })
// })

app.post('/handleText', function(req,res){
  if(req.body.Body==="nihar"){
    client.messages.create({
  to: "+19176835939",
  from: "+19292948541",
  body: "Over the horizons"
})

  }
  else if(req.body.Body==='cesar'){
    client.messages.create({
  to: "+19176835939",
  from: "+19292948541",
  body: "Oi pai tudo bem?"
})


  }
  else{
    client.messages.create({
    to: "+19176835939",
    from: "+19292948541",
    body: "How is it going"
  })


}


  res.end()
})

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
