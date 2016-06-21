// Your code here!
//input sengrid:
var sendgrid= require('sendgrid')
var api ="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";
  var helper = require('sendgrid').mail
  from_email = new helper.Email("test@example.com")
  to_email = new helper.Email("taycon@seas.upenn.edu")
  subject = "Hello World from the SendGrid Node.js Library"
  content = new helper.Content("text/plain", "some text here")
  mail = new helper.Mail(from_email, subject, to_email, content)

  var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
  var requestBody = mail.toJSON()
  var request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sg.API(request, function (response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  })