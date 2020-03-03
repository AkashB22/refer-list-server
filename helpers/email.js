let nodemailer = require('nodemailer');

let email = {};

email.sendEmail = async function(mailOption){
  return new Promise(async (resolve, reject) => {
    try{
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS
        }
      });

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOption);

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      resolve(info);
    } catch(e){
      console.log('email not sent');
      reject(e);
    }
  });
}

module.exports = email;