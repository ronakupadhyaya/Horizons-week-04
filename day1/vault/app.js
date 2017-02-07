"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models').User;

//STUFF I NEED TO UNDERSTAND
var routes = require('./routes/index');
var auth = require('./routes/auth');
var models = require('./models/models');
// var passwords = require('./passwords.hashed.json').passwords;
var hashPassword = require('./hashPassword');

// var unicorn = require ('cookie-session');
var session = require('express-session');
// app.use(session({secret:'here's }))

// Express setup
var app = express();
var router = express.Router();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
mongoose.connection.on('connected', function(){
  console.log("CONNECTED TO MONGODB, BETCHES!")
});

mongoose.connect('mongodb://moose:moose@ds145039.mlab.com:45039/vaults');

var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

router.use(session({
  secret: 'your secret here',
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));
// app.use(unicorn({ //line 10
//   keys: ['TOP SECRET PASSWORD'],
//   maxAge:1000*60*2 //expires your session past this
// }));

app.use(session({
  secret: 'i love lisa truong',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));


  app.use(passport.initialize());
  app.use(passport.session()); //

  passport.serializeUser(function(user,done){
    done(null, user._id)
    // you want to break it up so you're not throwing around usernames and passwords while they're logged in
  })


  passport.deserializeUser(function(id, done){
    console.log("called");
    // passwords.forEach(function(user){
    //   if(user._id === id){
    //     console.log('123');

    models.User.findbyId(id, function(err, user){
      if(err){
        console.log("there was an error here")
      } else {
        done(null, user);

      }
    })
  }) //you want to build it back

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var hashedPassword = hashPassword(password);

      models.User.findOne({username:username}, function(err, user){
        if(err){
          console.log("error", err);
          return done(err);
        }
        if(!user){
          return done(null, false, {message: 'USER NOT HERE'})
        }
        if(user.password !== hashedPassword){
          return done(null, false, {message: 'PASSWORD WRONG'});
        }

        return done(null, user)
        // if(user.password === hashedPassword){
        //   found = true;
        //   return done(null, user);
        // } else {
        //   return done(null,false);

      })
    }
))
//     var found = false;
//     // read passwords from json
//     passwords.forEach(function(user){
//       if(user.password === hashedPassword){
//         found = true;
//         return done(null, user);
//       }
//     });
//     if(!found){
//       return done(null,false);
//     }
//   })
// )

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE


app.use('/', auth(passport));
app.use('/', routes);

// PASSPORT MIDDLEWARE HERE

// YOUR ROUTES HERE

app.get('/', function(req, res) {
  console.log("HERE I AM")
  // console.log(req.session)
  if (req.user){

    res.render('index', { user: req.user })
  } else {
    res.redirect('/login')
  }
}
);

app.get('/login',
function(req, res){
  res.render('login');
});

//app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/'})),

app.post('/login',
passport.authenticate('local', { failureRedirect: '/login' }),
function(req, res) {
  console.log("success", req.user )
  res.redirect('/');
});

app.get('/logout',
function(req, res){
  req.logout();
  res.redirect('/');
});


app.get('/signup',
function(req, res){
  res.render('signup');
});


//VALIDATE:

function validate(req){
  req.checkBody('username', 'Invalid').notEmpty();
  req.checkBody('password', 'Invalid').notEmpty();
}

app.post('/signup', function(req,res){

  User.findOne({username: req.body.username}, function(err,user){
    if(!user){
      var thisUser = new User({
        username: req.body.username,
        hashedPassword: req.body.password
      });

      thisUser.save(function(err){
        console.log("save")
        if (err){
          console.log("error", err);
          res.redirect('/login');

        } else {
          res.send('Success!')
          // res.redirect('/login');
        }
      })
    } else {
      console.log("something's invalid")
    }
  })
})
//

// project.save(function(err) {
//   if (err) {
//     res.status(500).json(err);
//   } else {
//     res.send('Success: created a Project object in MongoDb');
//   }
// validate(req);
// var err = req.validationErrors();
// if (err) {
//   console.log("error", err)
// } else {
//   // console.log(req.body.enumValues);
//   // var category = Project.path('category').enumValues
//   // console.log(category);
//
//
//   thisUser.save(function(err){
//     console.log("save")
//     if (err){
//       console.log("error", err);
//     }
//     res.redirect('/login');
//     })
//
//
//   // res.render('new');
// }
// })



// function(req, res){
//   res.render('signup');
// });









module.exports = app;
