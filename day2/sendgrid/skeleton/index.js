// Your code here!

  var helper = require('sendgrid').mail
  from_email = new helper.Email("lucasmandelbaum@gmail.com")
  to_email = new helper.Email("lmandelbaum1@babson.com")
  subject = "Hello World from the SendGrid Node.js Library"
  content = new helper.Content("text/plain", "some text here")
  mail = new helper.Mail(from_email, subject, to_email, content)
  var apiKey = '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'

var sg = require('sendgrid').SendGrid(process.env.apiKey)

// GET Collection
var request = sg.emptyRequest()
request.method = 'GET'
request.path = '/v3/api_keys'
sg.API(request, function (response) {
  console.log(response.statusCode)
  console.log(response.body)
  console.log(response.headers)
})
