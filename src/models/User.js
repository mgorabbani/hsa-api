import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
const gravatarUrl = require('gravatar-url');
// TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
    },
    fb_url: {
      type: String,
    },
    bd_uni: {
      type: String,
    },
    undergradcgpa: {
      type: Number,
    },
    unitotal: {
      type: Number,
    },
    univarbal: {
      type: Number,
    },
    uniquant: {
      type: Number,
    },
    uniawa: {
      type: Number,
    },
    ieltstotal: {
      type: Number
    },
    ieltsreading: {
      type: Number
    },
    ieltswriting: {
      type: Number
    },
    ieltslistening: {
      type: Number
    },
    ieltsspeaking: {
      type: Number
    },
    toefltotal: {
      type: Number
    },
    toeflreading: {
      type: Number
    },
    toeflwriting: {
      type: Number
    },
    toefllistening: {
      type: Number
    },
    toeflspeaking: {
      type: Number
    },

    publication_number: {
      type: Number
    },
    job_experience: {
      type: String
    },
    research_experience: {
      type: String
    },
    applied_university: {
      type: String
    },
    accepted_university: {
      type: String
    },

    unitest: {
      type: String
    },
    langtest: {
      type: String
    },
    intjournal: {
      type: Number
    },

    intconference: {
      type: Number
    },
    natjournal: {
      type: Number
    },
    natconference: {
      type: Number
    },

    incoming_university: {
      type: String
    },
    admission_in: {
      type: String
    },
    major: {
      type: String
    },
    research_area: {
      type: String
    },
    financial_aid: {
      type: [String]
    },
    bucket_list: [{ name: 'string' }],
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" },
  },
  { timestamps: true }
);
schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  return `${
    process.env.HOST
    }/reset_password/${this.generateResetPasswordToken()}`;
};
schema.methods.generatePhoto = function generatePhoto() {
  return gravatarUrl(this.email, { size: 200 });
}
schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      name: this.name,
      confirmed: this.confirmed
    },
    process.env.JWT_SECRET
  );
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  let v, q, gretotal, tr, tl, ts, tw, ir, is, il, iw, toefl, ielts;
  q = this.uniquant || 0
  v = this.univarbal || 0

  tr = this.toeflreading || 0
  tl = this.toefllistening || 0
  ts = this.toeflspeaking || 0
  tw = this.toeflwriting || 0

  ir = this.ieltsreading || 0
  il = this.ieltslistening || 0
  is = this.ieltsspeaking || 0
  iw = this.ieltswriting || 0

  toefl = tr + tl + ts + tw;
  ielts = ir + il + is + iw;
  gretotal = parseInt(q) + parseInt(v)
  return {
    email: this.email,
    confirmed: this.confirmed,
    name: this.name,
    photo: this.generatePhoto(),
    phone: this.phone,
    fb_url: this.fb_url,
    bd_uni: this.bd_uni,
    undergradcgpa: this.undergradcgpa,
    unitest: this.unitest,
    unitotal: gretotal,
    univarbal: this.univarbal,
    uniquant: this.uniquant,
    uniawa: this.uniawa,
    langtest: this.langtest,

    toefltotal: toefl,
    toeflreading: this.toeflreading,
    toeflwriting: this.toeflwriting,
    toefllistening: this.toefllistening,
    toeflspeaking: this.toeflspeaking,

    ieltstotal: ielts,
    ieltsreading: this.ieltsreading,
    ieltswriting: this.ieltswriting,
    ieltslistening: this.ieltslistening,
    ieltsspeaking: this.ieltsspeaking,

    publication_number: this.intjournal + this.intconference + this.natjournal + this.natconference,
    job_experience: this.job_experience,

    bucket_list: this.bucket_list,

    intjournal: this.intjournal,
    intconference: this.intconference,
    natjournal: this.natjournal,
    natconference: this.natconference,
    research_experience: this.research_experience,
    applied_university: this.applied_university,
    accepted_university: this.accepted_university,
    incoming_university: this.incoming_university,
    admission_in: this.admission_in,
    major: this.major,
    research_area: this.research_area,
    financial_aid: this.financial_aid,
    token: this.generateJWT()
  };
};
schema.plugin(uniqueValidator, {
  message: "It is already taken, try another one."
});

export default mongoose.model("User", schema);
