var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/text',function(res,req,next) {
	console.log(JSON.stringify(req.body))
	res.status(200).send('ok')
})

module.exports = router;
