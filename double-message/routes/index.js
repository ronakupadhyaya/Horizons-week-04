var express = require('express');
var router = express.Router();
var models = require('../models/models');
var Contact = models.Contact;
var Message = models.Message;

var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var fromNumber = process.env.MY_TWILIO_NUMBER;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

function getUser(req, res, next) {
  User.findById(req.user._id, function(err, u) {
    if (err) {
      console.log("Serer Error")
    } else {
      req.u = u;
      next();
    }
  })
}

function getReceiver(req, res, next) {
  Contact.findById(req.contact)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/contacts');
});

router.get('/contacts', function(req, res) {
  Contact.find({owner: req.user._id}, function(err, contacts) {
    if (err) {
      console.log("Could not find contacts")
    } else {
      res.render('contacts', {user: req.user, contacts: contacts})
    }
  })
})

router.get('/contacts/new', function(req, res) {
  res.render('editContact');
})

router.get('/contacts/:id', function(req, res) {
  Contact.findOne({owner: req.user._id, _id: req.params.id}, function(err, contact) {
    if (err) {
      console.log("Could not find contact");
    } else {
      res.render('editContact', {contact: contact});
    }
  })
})

function validateContact(contact) {
  console.log(contact.phone.length);
  if (!contact.name) {
    return "Contact needs name";
  } else if (contact.phone.length !== 11) {
    return "Contact needs 11 digits";
  } else {
    return "";
  }
}

router.post('/contacts/new', function(req, res) {
  var validity = validateContact(req.body);
  if (!validity) {
    var newContact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      owner: req.user
    })
    newContact.save(function(err) {
      if (err) {
        console.log("Error with saving contact");
      }
      res.redirect('/contacts');
    })
  } else {
    res.render('editContact', {error: validity});
  }
})

router.post('/contacts/:id', function(req, res) {
  var validity = validateContact(req.body);
  if (!validity) {
    Contact.findOneAndUpdate({owner: req.user._id, _id: req.params.id}, {$set: {name: req.body.name, phone: req.body.phone}}, function(err) {
      if (err) {
        console.log("Error updating contact");
      }
      res.redirect('/contacts');
    })
  } else {
    Contact.findOne({owner: req.user._id, _id: req.params.id}, function(err, contact) {
      if (err) {
        console.log("Could not find contact");
      } else {
        res.render('editContact', {contact: contact, error: validity});
      }
    })
  }
})

router.get('/messages', function(req, res) {
  Message.populate('User', 'Contact').find({user: req.user}, function(err, messages) {
    if (err) {
      console.log("Server Error");
    } else {
      res.render('messages', {
        contact: messages.contact,
        sender: messages.user,
        content: messages.content,
        channel: messages.channel,
        formattedDate: messages.createdAt
      })
    }
  })
})

router.get('/messages/contactId', function(req, res) {
  Message.populate('User', 'Contact').find({user: req.user, contact: }, function(err, messages) {
    if (err) {
      console.log("Server Error");
    } else {
      res.render('messages', {
        contact: messages.contact,
        sender: messages.user,
        content: messages.content,
        channel: messages.channel,
        formattedDate: messages.createdAt
      })
    }
  })
})





















module.exports = router;
