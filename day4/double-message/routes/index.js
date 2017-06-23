var express = require('express');
var router = express.Router();
var validator = require('express-validator');
var User = require('../models/models.js').User;
var Contact = require('../models/models.js').Contact;
var Message = require('../models/models.js').Message;
router.use(validator());
var passport = require('passport');
var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
var fromNumber = process.env.MY_TWILIO_NUMBER; // Your custom Twilio number
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

/* GET home page. */
router.get('/', function(req, res, next) {
  // Your code here.
});

router.get('/signup',function(req,res){
  res.render('signup')
});

router.post('/signup',function(req,res){
  req.check('username','username is required').notEmpty();
  req.check('password','password is required').notEmpty();

  var errors = req.validationErrors();
  if (errors){
    console.log(errors);
  }
  else{
    var newUser = new User({
      username:req.body.username,
      password:req.body.password
    })
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/login')
      }
    })
  }
})

router.get('/login',function(req,res){
  res.render('login')
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/contacts',
  failureRedirect:'/login'
}))

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');
})

router.get('/contacts',function(req,res){
  Contact.find({owner:req.user.id},function(err,contacts){
    res.render('contacts',{
      contacts:contacts
    });
  })
})

router.get('/contacts/new',function(req,res){
  res.render('newContact')
})

router.get('/contacts/:id',function(req,res){
  Contact.findOne({_id:req.params.id},function(err,contact){
    if(err){
      console.log(err);
    }
    else{
      res.render('editContact',{
        contact:contact
      })
    }
  })

})

router.post('/contacts/new',function(req,res){
  var newContact = new Contact({
    name:req.body.name,
    number:req.body.number,
    owner:req.user._id
  })
  newContact.save(function(err){
    if(err){
      console.log(err);
    }
    else {
      res.redirect('/contacts')
    }
  })
})

router.post('/contacts/:id',function(req,res){
  Contact.findByIdAndUpdate({_id:req.params.id},
    {name:req.body.name,
    number:req.body.number
    },function(err){
    if (err){
      console.log(err);
    }
    else {
      res.redirect('/contacts')
    }
  })
})

router.get('/messages',function(req,res){
    Message.findById(req.user._id)
    .populate('contact')
    .exec(function(err,messages){
      res.render('messages',{
        messages:messages
      })
    })
})

router.get('/messages/:contactId',function(req,res){
  Message.findById({"contact._id":req.params.contactId})
  .populate('contact')
  .exec(function(err,messages){
    res.render('messages',{
      messages:messages
    })
  })
})

router.get('/messages/send/:contactId',function(req,res) {
  res.render('newMessage')
})

router.post('/messages/send/:contactId',function(req,res) {
  var data = {
    body: req.body.message,
    to: '+1' + contact.phone, // a 10-digit number
    from: fromNumber
  };

  client.messages.create(data, function(err, msg) {
    console.log(err, msg);

  var newMessage = new Message({
    created:Date.now(),
    content:req.body.content,
    user:req.user,
    contact:req.params.contactId,
    channel:'SMS'
  })

  newMessage.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      res.redirect('/messages')
    }
  })
  });
})

module.exports = router;
