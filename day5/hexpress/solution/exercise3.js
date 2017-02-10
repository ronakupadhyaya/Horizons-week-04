var hexpress = require('./lib/hexpress');
var app = hexpress();
var route = hexpress();

// this adds middleware that will console log
// the current time on your Node console when any
// endpoint following /api is hit
app.use('/api', function (req, res) {
  console.log('Time: %d', Date.now());
});

// an endpoint to get the version number of our API
app.get('/api/version', function(req, res) {
  res.send('Hexpress v1.0')
});

// Verify Your Solution:
// 1. run this file
// 2. navigate to http://localhost:3000/api/version
// 3. you should see Hexpress v1.0 on the browser
// 4. go to node console and you should see Time: current-time

app.listen(3000);
