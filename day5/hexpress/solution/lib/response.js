var http = require('http');
var fs = require('fs');
var handlebars = require('handlebars');

var res = exports = module.exports = {
  __proto__: http.ServerResponse.prototype
};

res.send = function send(body) {
  this.writeHead(200, { 'Content-Type': 'text/plain' });
  this.end(body);
};

res.json = function json(obj) {
  var body = JSON.stringify(obj);
  this.writeHead(200, { 'Content-Type': 'application/json' });
  this.end(body);
};

res.render = function(name, options) {
  this.writeHead(200, { 'Content-Type': 'text/html' });
  var file = name.includes('.hbs') ? name : name + '.hbs';
  this.end((handlebars.compile(fs.readFileSync(file, 'utf8')))(options));
};

return res;
