var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lenmorld2@gmail.com',
    pass: 'nodeREACT1234'
  }
});

var mailOptions = {
  from: 'lenmorld2@gmail.com',
  to: 'lenmorld@live.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
