// Your code here!

  var helper = require('sendgrid').mail;
  from_email = new helper.Email("toodles@shotz.com");
  to_email = new helper.Email("jpak@wellesley.edu");
  subject = "SHOTZ !!! @ wonder bar";
  content = new helper.Content("text/plain", "free shots tonight at wonderbar! you are only allowed 1/2 shot tho. come claim tonite !!!!");
  mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);
  var requestBody = mail.toJSON();
  var request = sg.emptyRequest();
  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, function (response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  })