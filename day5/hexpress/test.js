var hexpress = require('./hexpress');
var app2 = hexpress();
app2.get('/', function(req, res) {
  res.send('I AM FIRST');
});

var app = hexpress();
app.get('/', function(req, res) {
  res.send('Hello ' + req.query.name);
});

app.get('/bye', function(req, res) {
  res.send('Goodbye ' + req.query.name);
});


app.listen(3000);
