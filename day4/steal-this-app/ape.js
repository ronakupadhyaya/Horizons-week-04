"use strict";

var path = require('path');
var express = require('express');
var _ = require('underscore');


var app = express();
app.engine('hbs', require('express-handlebars')({extname: 'hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var cookieSession = require('cookie-session');
app.use(cookieSession({
  httpOnly: false,
  keys: ['SECRET THING HERE']
}));

var mongoose = require('mongoose');
mongoose.connect(require('./connect'));


app.get('/', function(req, res) {
  res.render('index');
});

app.post('/login', function(req, res) {
  console.log('req.body', req.body);
  if (req.body.username === 'moose' && req.body.password === 'gingerbread') {
    req.session.user = 'moose'
    res.redirect('/donate');
  } else {
    res.redirect('/');
  }
});

app.use(function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
});

app.get('/secret', function(req, res) {
  if (req.query.username === 'moose' && req.query.password === 'gingerbread') {
    res.render('secret');
  } else {
    res.status(401).send('Unauthorized!');
  }
});

var Donation = mongoose.model('donation', {
  who: String,
  amount: {
    type: Number,
    min: 1
  }
});

var csurf = require('csurf');
app.use(csurf());

app.get('/donate', function(req, res) {
  Donation.find(function(err, donations) {
    var total = donations.map(function(donation) {
      return donation.amount
    }).reduce(function(a, b) {
      return a + b;
    }, 0);
    res.render('donate', {
      something: '><',
      total: total,
      csrfToken: req.csrfToken,
      donations: donations
    });
  });
});


app.get('/donate/delete/:id', function(req, res) {
  Donation.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.status(500).json(err);
    } else {
      res.redirect('/donate')
    }
  });
});

app.post('/donate/new', function(req, res) {
  var amount = parseInt(req.body.amount);
  // if (amount < 1) {
  //   res.redirect('/donate');
  // } else {
    var donation = new Donation({amount: amount, who: req.body.who});
    donation.save(function(err) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.redirect('/donate')
      }
    });
  // }
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.session.user
  });
});

app.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/login');
});

app.post('/login', function(req, res) {
  if (req.body.username === 'moose' && req.body.password === 'moosie') {
    req.session.user = 'moose';
    res.redirect('/login');
  } else {
    res.status(401).send('Bad username or password');
  }
});

app.get('/readSecret', function(req, res) {
  Model.findOne({
    secret: req.query.secret
  }, function(err, model) {
    res.json(model);
  })
});

app.listen(3000);
