// Your code here!
 var helper = require('sendgrid').mail
  from_email = new helper.Email("lane@joinhorizons.com")
  to_email = new helper.Email("jmccarthy2@babson.edu")
  subject = "Yoga?"
  content = new helper.Content("text/plain", "Wanna do some yoga buddy?")
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