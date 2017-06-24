var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Contact = models.Contact;
var Message = models.Message;

//twilio
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var fromNumber = process.env.MY_TWILIO_NUMBER;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


/* GET home page. */
router.get('/', function(req, res, next) {
  // Your code here.
});

router.get('/contacts', function(req, res) {
  // params??
  // console.log(req.user)
  if (!req.user) {
    res.redirect('/login')
  }

  User.findById(req.user._id, function(err, user) {
    Contact.find({owner: req.user._id}, function(err, contacts) {
      res.render('contacts', {
        contacts: contacts,
      })
    })
  })
});

router.get('/contacts/new', function(req, res) {
  console.log('hi');
  Contact.find({owner: req.user._id}, function(err, contact) {
    console.log(contact);
    res.render('editContact', {
      contact: contact[0],

    })
  })
  // res.render('editContact')
})

router.post('/contacts/new', function(req, res) {
  console.log('update contact');
  console.log(req.body.name);
  var newContact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    owner: req.user._id //??
  })
  console.log(newContact);
  newContact.save(function(err) {
    if (err) {
      console.log("failed to save new contact")
    } else {
      res.redirect('/contacts')
    }
  })

})


router.get('/contacts/:id', function(req, res) {
  Contact.findById(req.params.id, function(err, contact) {
    console.log(contact)
    if (err) {console.log('cannot find the contact');} else {
      res.render('editContact', {
        contact: contact
      });
    }
  });
})

router.post('/contacts/:id', function(req, res) {
  Contact.findById(req.params.id, function(err, contact) {
    // console.log(contact);
    contact.name = req.body.name
    contact.phone = req.body.phone
    contact.owner = req.user._id
    contact.save(function(err) {
      if (err) {
        console.log('failed to edit contact')
      } else {
        res.redirect('/contacts')
      }
    })
  })
})

//Message
router.get('/messages', function(req, res) {
  Message.find({user: req.user._id}, function(err, messages) {
    if (err) {
      console.log("error when trying to get messages")
    } else {
      res.render('messages', {
        messages: messages
      })
    }
  })
})

router.get('/messages/:contactId', function(req, res) {
  //Read messages sent to contactId belonging to req.user._id
  Contact.findById(req.params.contactId, function(err, contact){
    if (err) {
      console.log("error when finding the contact in get messages")
    } else {
      //Render messages.hbs with messages sent to contact
      //might need to populate('contact') to get the name of contact through messages.
      Message.find({user: req.user._id, contact: req.params.contactId})
      .populate('contact').exec(function(err, messages) {
        if (err) {
          console.log("error when finding the message");
        } else {
          res.render('messages', {
            messages: messages
          })
        }
      })
    }
  })



})

router.get('/messages/send/:contactId', function(req, res) {
  //send a message to a contact by contactId
  // console.log(req.params.contactId);
  Contact.findById(req.params.contactId, function(err, contact) {
    res.render('newMessage', {
      contact: contact
    })
  })
})

router.post('/messages/send/:contactId', function(req, res) {
  //Send message with Twilio to contactId
  var contactName;
  var contactPhone
  Contact.findById(req.params.contactId, function(err, contact) {
    if (err) {
      console.log('failed to find the contact given id')
    } else {
      //Create message in mongoose if Twilio is successful
      contactName = contact.name
      contactPhone = contact.phone
      console.log('contact', contact);
      var newMessage = new Message({
        created: new Date(),
        content: req.body.message,
        user: req.user._id,
        contact: contact._id,
        channel: 'SMS'
      });

      client.messages.create({
        body: req.body.message,
        to: "+1" + contact.phone,
        from: fromNumber
      }, function(err, message) {
        if (err) {console.log("error when sending message")} else {
          newMessage.save(function(err) {
            if(err) {console.log("error when saving message");} else {
              res.redirect('/messages')
            }
          });
        }
      })
    }
  })
})



module.exports = router;
