"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var from = '"HSA STUDENTS" <app@higherstudyabroad.com>';

function setup() {
  return _nodemailer2.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

function sendConfirmationEmail(user) {
  var tranport = setup();
  var email = {
    from: from,
    to: user.email,
    subject: "Welcome to HSA Students App",
    text: "\n    Welcome to HSA Students App. Please, confirm your email.\n\n    " + user.generateConfirmationUrl() + "\n    "
  };

  tranport.sendMail(email);
}

function sendResetPasswordEmail(user) {
  var tranport = setup();
  var email = {
    from: from,
    to: user.email,
    subject: "Reset Password",
    text: "\n    To reset password follow this link\n\n    " + user.generateResetPasswordLink() + "\n    "
  };

  tranport.sendMail(email);
}
//# sourceMappingURL=mailer.js.map