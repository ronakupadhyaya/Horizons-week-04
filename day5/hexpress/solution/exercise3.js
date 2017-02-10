var hexpress = require('./lib/hexpress');
var app = hexpress();
var route = hexpress();

route.get('/', function(req, res) {
});

app.use('/api', route);

app.listen(3000);
