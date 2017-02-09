var hexpress = require('./hexpress');
var app = hexpress();

app.get('/', function(req, res) {
  res.send('First endpoint!');
});

app.get('/query', function(req, res) {
  res.json(req.query);
});

app.listen(3000);
