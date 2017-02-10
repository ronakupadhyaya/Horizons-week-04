var http = require('http');

var res = exports = module.exports = {
  __proto__: http.ServerResponse.prototype
};

res.status = function status(code) {
  this.statusCode = code;
  return this;
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

return res;
