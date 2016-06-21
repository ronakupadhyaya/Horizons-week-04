var twilio = require('twilio');

//require the Twilio module and create a REST client
if(!(process.env.ACCOUNT_SID && process.env.AUTH_TOKEN)) {
    throw new Error("Missing Twilio Credentials")
}

var client = 
require('twilio')(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN);

//Send an SMS text message
client.sendMessage({

    to:'+16515556677', // Any number Twilio can deliver to
    from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    }
});