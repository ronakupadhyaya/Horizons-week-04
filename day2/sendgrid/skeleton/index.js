// Your code here!
var helper = require('sendgrid').mail
  from_email = new helper.Email("igong@sas.upenn.edu")
  to_email = new helper.Email("igong@sas.upenn.edu")
  subject = "Hello World from the SendGrid Node.js Library"
  content = new helper.Content("text/plain", "I'm learning how to use the SendGrid API which allows your app to send emails! Hope this finds you well.")
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