var hexpress = require('./hexpress');
var app = hexpress();

// app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(req, res) {
  res.send('TEST');
})

app.get('/', function(req, res) {
  res.send('HELLO AGAIN' + req.query.name)
})

app.listen(3000);
