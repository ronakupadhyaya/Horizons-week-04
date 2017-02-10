var hexpress = require('./lib/hexpress');
var app = hexpress();

// Simple route should send the text 'First endpoint!'
// as the response. The content type header should be
// set to text/plain.
app.get('/', function(req, res) {
  res.send('First endpoint!');
});

// This route should never be called.
// Visiting / should execute the previous route.
app.get('/', function(req, res) {
  res.send('Ignored');
});

// This route should send all of the query parameters
// back as a JSON string.
// Response type should be application/json
app.get('/query', function(req, res) {
  res.json(req.query);
});

app.post('/login', function(req, res) {
  res.json({success: true})
});

app.listen(3000);
