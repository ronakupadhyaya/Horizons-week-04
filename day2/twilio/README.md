# Inline exercise: Twilio TwiML voicemail
## Time limit: 10 minutes

## Goal

You've already seen how to use Twilio to send outgoing SMS messages, as part of
the [TwilioShoutout](https://github.com/horizons-school-of-technology/week02/tree/master/day4/1_twilio)
exercise. In this exercise, you're going to set a voice message that plays when
someone calls your Twilio phone number.

Note: this exercise assumes you already created a free Twilio account, and
selected a phone number, in the TwilioShoutout exercise. If you haven't done
that, please do that first.

## Instructions

Log into the Twilio site and head over to
https://www.twilio.com/console/dev-tools/twiml-bins. Click the plus button to
create a new TwiML bin. Give it a "friendly name" such as "Voicemail." Paste the
following into the TwiML body:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="woman">Hello, how are you today?</Say>
</Response>
```  

Click Create. Next, head to
https://www.twilio.com/console/phone-numbers/dashboard to view your Twilio phone
numbers. Click on your number in the Recent Phone Numbers list. In the Voice
section, under "A Call Comes In", set the first dropdown to TwiML, then choose
your "Voicemail" TwiML in the dropdown to the right. Click Save at the bottom.

That's it! Now try calling your Twilio phone number. You'll hear an obnoxious
message about having a trial account, then you should hear a woman's voice say,
"Hello, how are you today?"

You can do all sorts of fun stuff with TwiML. Check out the [TwiML API
docs](https://www.twilio.com/docs/api/twiml). Play around and try changing the
text or using commands other than `Say`. You can just update the TwiML bin, you
don't need to update the phone number settings every time you change the TwiML.
