var hexpress = require('./lib/hexpress');
var app = hexpress();

// This route will respond with status 200 and the
// JSON object {success: true, username: req.body.username, password: req.body.password}
// where req.body.username will be the username posted to the endpoint
// and req.body.password will be the password posted to the endpoint
//
// Use POSTMAN to POST to localhost:3000/login with body
//  - username: your-username
//  - password: your-password
app.post('/login', function(req, res) {
  res.json({n
    success: true,
    username: req.body.username,
    password: req.body.password
  });
});

app.listen(3000);
