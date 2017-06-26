var express = require('express');
var path = require('path');

var app = express();
var hbs = require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs'
});
// var FacebookStrategy = require('passport-facebook');
// passport.use(new FacebookStrategy({
//   clientID:process.env.FACEBOOK_APP_ID,
//   clientSecret: process.enc.FACEBOOK_APP_SECRET,
//   callbackURL: 'http://localhost:3000/fb/login/callback'
// },
// function(accessToken, refreshToken,profile,done){
//   done(null, {
//     token: accessToken,
//     name: profile.displayName,
//     id: profile.id
//   })
// }));

app.engine('hbs', hbs);
app.set('view engine', 'hbs');

var session = require('cookie-session');
app.use(session({keys: ['some private info']}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
