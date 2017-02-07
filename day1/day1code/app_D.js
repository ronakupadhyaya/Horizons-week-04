var express = require('express');
var app = express();

var port = 3000;

app.get('/:name',function(req,res) {
    var name = req.query.name;
    var string = '<h1>' + name + '</h1>';
    res.send(string);
});


app.listen(port);