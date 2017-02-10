var hexpress = require('./hexpress');
var app = hexpress();

// this console logs Logging Version Number whenever
// an endpoint following /api/version is hit
app.use('/api/version', function (req, res) {
  console.log('Logging Version Number');
});

// this adds middleware that will console log
// the current time on your Node console when any
// endpoint following /api is hit
app.use('/api', function (req, res) {
  console.log('Time: %d', Date.now());
});

// an endpoint to get the version number of our API
app.get('/api/version/number', function(req, res) {
  res.send('Hexpress v1.0')
});

// Verify Your Solution:
// 1. run this file
// 2. navigate to http://localhost:3000/api/version/number
// 3. you should see Hexpress v1.0 on the browser
// 4. go to node console and you should see the following in this order:
//    $ Time: current-time
//    $ Logging Version Number

app.listen(3000);
