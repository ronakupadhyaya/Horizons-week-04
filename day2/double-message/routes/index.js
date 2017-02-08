var express = require('express');
var router = express.Router();

var Contact = require('../models/models.js').Contact;
var Message = require('../models/models.js').Message;

var client = require('twilio')("AC3a13d1ff6cc8d37ddb6d6967aa0a4f35", "33e26e6c2966c4aa68718919e124c470");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('hello')
});

router.get('/contacts', function(req, res, next) {
  Contact.find({}, function(err, foundContact) {
    if(err) {
      res.status(500).json(err);
    } else {
      res.render('contacts', { // rendering contacts using contacts.hbs
        contact: foundContact
      })
    }
  })
})

router.get('/contacts/new', function(req, res, next) {
  res.render('editContact.hbs', { action : '/contacts/new',
  buttonName: "New Contact"});
})

router.get('/contacts/:id', function(req, res, next) {
  var id = req.params.id
  Contact.findById( id, function(err, foundContact) {
    if(err) {
      res.status(500).json(err);
    } else {
      res.render('editContact.hbs', { action : '/contacts/'+id,
      buttonName : "Update Contact" });
    }
  });
});

router.post('/contacts/new', function(req, res, next) {
  var newName = req.body.name;
  var newPhone = req.body.phone;
  var contact = new Contact ({
    name: newName,
    phone: newPhone
    // HOW TO IMPLEMENT OWNERS HERE
  });
  contact.save(function(err) {
    if(err) {
      res.status(500).json(err);
    } else {
      res.redirect('/contacts');
    }
  });
});

router.post('/contacts/:id', function(req, res, next) {
  var newId = req.body.id;
  var newName = req.body.name;
  var newPhone = req.body.phone;
  Contact.findOneAndUpdate({id: newId},{name: newName, phone: newPhone}, {new: true}, function(err, updatedContact) {
    // if we include {new: true}, the returned object is the UPDATED one
    if(err) {
      res.status(500).json(err);
    } else {
      console.log('updated');
      console.log(updatedContact);
      res.redirect('/contacts')
    }
  });
});

////////////////////////////////////////////////////////////////////////

router.get('/messages', function(req, res, next) {
  Message.find({}, function(err, foundMessage) {
    if(err) {
      res.status(200).json(err);
    } else {
      res.render('messages', {
        foundMessage: foundMessage
      })
    }
  })
})

router.get('/messages/:contactId', function(req, res, next) {
  Message.find({contactId: req.params.contactId}, function(err, foundMessage) {
    if(err) {
      res.status(200).json(err);
    } else {
      res.render('newMessage', {
        foundMessage: foundMessage
      })
    }
  })
})

router.get('/messages/send/:contactId', function(req, res, next) {
  res.render('newMessage', {
    contactId: req.params.contactId
  })
})

router.post('/messages/send/:contactId', function(req, res, next) {
  Contact.findById(req.params.contactId, function(err, foundContact) {
    console.log(foundContact)
    console.log(foundContact._id);
    console.log(req.body.content);
    console.log(foundContact.phone);
    if(err) {
      res.status(200).json(err);
    } else {
      var message = new Message({
        created: new Date(),
        content: req.body.content,
        userId: req.user._id,
        contactId: foundContact._id
      })
      console.log('message')
      console.log(message)
      res.send('Sending text: ' + req.query.body);
      client.sendMessage({
        to: foundContact.phone,
        from: '+12532631339', // do we need to change this
        body: req.body.content
      })
      // function(err, responseData) {
      //   if(err) {
      //     // res.status(500).json(err);
      //     console.log('EROORORRORORORORORO');
      //   } else {
      //     res.json(responseData); // implies 200 : successful response
      //   }
    }
  })
});


module.exports = router;
