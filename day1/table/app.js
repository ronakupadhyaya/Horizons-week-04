
var express = require('express')
var app = express()
var helmet = require('helmet')

app.use(helmet());
app.use(function(req, res, next) {
  console.log(" 1");
  // res.send('hello from 1')
  next();
})

app.use(function(req, res, next) {
  console.log("2");
  // res.send('hello from 2')
  next();
})
// __dirname = path to current directory
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/table.html')
})

app.use('/static',express.static('public'))



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
