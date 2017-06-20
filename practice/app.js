const express = require('express')
const app = express()


app.use("/",function(req,res,next){
  console.log("1");
  next();
});

app.use("/",function(req,res,next){
  console.log("2");
  next();
});

app.use('/static', express.static('public'));
//.use sets up middleware

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/table.html");
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
