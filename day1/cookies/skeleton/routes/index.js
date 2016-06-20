var express = require('express');
var router = express.Router();

// Access the session as req.session
router.get('/', function(req, res, next) {
  var sess = req.session;
  // var sess = {};
  res.setHeader('Content-Type', 'text/html');
  if (sess.views) {
    sess.views++;
    res.write("<h1>I've seen you before " + sess.views + " times!</h1>");
    res.end()
  } else {
    sess.views = 0;
    res.write("<h1>Looks like you're new. Refresh to get started.</h1>");
    res.end()
  }
});

router.get('/reset', function(req, res, next) {
  var sess = req.session;
  delete sess.views;
  res.end('Reset!')
});

module.exports = router;
