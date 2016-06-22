var Contact = require('../models/contact.js');
var Message = require('../models/message.js');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.hbs'); // load the index.hbs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.hbs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure dashboar section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ============================
    // =====================================
    app.get('/auth/facebook', passport.authenticate('facebook'));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.hbs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure dashboar section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // DASHBOARD SECTION ===================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard.hbs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // CONTACTS ============================
    // =====================================
    // whis will add new contact to an authenticated user
    app.post('/newcontact', isLoggedIn, function(req, res) {
        // create contact
        var newContact = new Contact();
        newContact.ownerId = req.user._id;
        newContact.name = req.body.name;
        newContact.email = req.body.email;
        newContact.phone = req.body.phone;

        // save the contact
        newContact.save(function(err) {
            if(!err) {
                res.json(newContact);
            } else {
                res.json(err);
            }
        });
    });

    // retrieve contacts for an authenticated user
    app.post('/contacts', isLoggedIn, function(req, res) {
        Contact.find({ 'ownerId' :  req.user._id }, function(err, contacts) {
            if(err) {
                res.json(err);
            } else {
                res.json(contacts);
            }
        });
    });

    // =====================================
    // MESSAGES ============================
    // =====================================
    // send a text message
    app.post('/message', isLoggedIn, function(req, res) {

        var accountSid = 'ACe47555a4e931127d04aa5b4b8384b4c9'; // Your Account SID from www.twilio.com/console
        var authToken = '28ee0b4d9b8126b2f7cfd241a6346992';   // Your Auth Token from www.twilio.com/console

        var twilio = require('twilio');
        var client = new twilio.RestClient(accountSid, authToken);
        console.log(req.body);
        client.messages.create({
            body: req.body.message,
            to: '+1'+req.body['contact[phone]'],  // Text this number
            from: '+18562889331' // twilio number
        }, function(err, message) {
            if(err) {
                console.log(err);
            } else {
                console.log(message.sid);

                var newMessage = new Message();
                newMessage.userId = req.body['contact[ownerId]'];
                newMessage.contactId = req.body['contact[_id]'];
                newMessage.direction = 'out';
                newMessage.type = 'sms';
                newMessage.createdAt = new Date();
                newMessage.text = req.body.message;

                // save message to database
                newMessage.save(function(err) {
                    if(err) {
                        res.json(err);
                    } else {
                        res.json(newMessage);
                    }
                })
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}