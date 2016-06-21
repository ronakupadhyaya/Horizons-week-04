var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//test this on postman with post to localhost:3000/text
router.post('/text', function(req, res, next){
  console.log(JSON.stringify(req.body));
  // next(); (next middleware is 404 function)
  res.status(200).send("ok");
});

module.exports = router;

//HOW TO PUBLISH TO HEROKU
//1. git init
//2. heroku create
//3. ls -la
//4. echo node_modules > .gitignore
//5. git add .
//6. git commit -m "initial commit"
//7. git push heroku master
//8. heroku logs --tail (get the url)
//9. change the url in twilio to receive in the heroku app and not on the computer

//10. git commit -m "add your comment here" -a

//cat = prints out the contents of a file

//HOW TO SET A MESSAGE IN THE FUTURE
// setTimeout(function(){
//   //send a SMS text MESSAGE
//   client.sendMessage(...)
// })
// }, 60000; //the amound of time in ms
