import nodemailer from "nodemailer";
require('dotenv').config();
const from = '"University Finder" <knight3rrantt@gmail.com>';

function setup() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'higherstudyabroad@gmail.com',
      pass: 'asadfade'
    }
  });
}

export function sendConfirmationEmail(user) {
  const tranport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Welcome to HSA Students App",
    text: `
    Welcome to HSA Students App. Please, confirm your email.

    ${user.generateConfirmationUrl()}
    `
  };

  tranport.sendMail(email).catch(e => console.log(e))
}

export function sendResetPasswordEmail(user) {
  const tranport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Reset Password",
    text: `
    To reset password follow this link

    ${user.generateResetPasswordLink()}
    `
  };

  tranport.sendMail(email).catch(e => console.log(e))
}
