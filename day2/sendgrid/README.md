# Inline exercise: Sendgrid outgoing email
## Time limit: 10 minutes

## Goal

Twilio and Sendgrid are two powerful tools that we can use to integrate
telephone (voice calls, SMS) and email into our applications, respectively. You
saw how to send outgoing SMS messages using Twilio's API. Your goal in this
exercise is to send an outgoing email using the Sendgrid API.

## Instructions

## What is Sendgrid?

Sendgrid is a cloud-based email service which has both a free tier (we like
free ✌️), and an API that lets us send and receive emails programmatically (from
inside our app). It's a lot like Twilio, but for email instead of telephony.

## Instructions

1. Head to https://app.sendgrid.com/signup in your browser.
1. Fill out the form. Make sure "Free 12k" is selected at the top right corner.
1. Check your email for the confirmation, and tap on the Confirm Email Address
   button.
1. Fill out the second form. Feel free to use the following values:
 - Company Name: Horizons School of Technology
 - Website URL: http://www.joinhorizons.com/
 - Street address: 3701 Chestnut St., Philadelphia, PA 19104
 - Occupation: Developer
 - What types of email do you plan on sending? Transactional (only)
 - Do you send email on behalf of other companies? No
 - What's your expected monthly email volume? 0 to 40k
 - What industry are you in? Education/Training
1. Take a look at the `skeleton/` directory, which has some very basic
   scaffolding. You'll be writing your code in `skeleton/index.js`, but you'll
   need to run some commands from the commandline too.
1. Install the [sendgrid](https://github.com/sendgrid/sendgrid)
   npm module.
1. Follow the instructions on that page to get your Sendgrid API key, then copy
   it into the `skeleton/sendgrid.env` file. Run `source sendgrid.env` at the
   commandline to set the environment variables.
1. Add the code under [Quick
   Start](https://github.com/sendgrid/sendgrid-nodejs#quick-start) to send your
   first outgoing email. Make sure to replace `to_email` with your email
   address!
1. Run your script from the commandline: `node index.js`.
1. Check your email!

