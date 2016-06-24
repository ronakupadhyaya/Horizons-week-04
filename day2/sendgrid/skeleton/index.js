var helper = require('sendgrid').mail
from_email = new helper.Email("test@example.com")
to_email = new helper.Email("eyinghang@gmail.com")
subject = "Hello World from the SendGrid Node.js Library"
content = new helper.Content("text/plain", "some text here")
mail = new helper.Mail(from_email, subject, to_email, content)

var sg = require('sendgrid').SendGrid('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')
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
