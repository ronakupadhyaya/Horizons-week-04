var hexpress = require('./hexpress');
var app = hexpress();

app.use('/', function (req, res, next) {
  console.log('Time: %d', Date.now());
});

app.get('/', function(req, res) {
  res.send('Success!')
});

app.listen(3000);
