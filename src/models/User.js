import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

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
      required: true,
      index: true,
      unique: true
    },
    phone: {
      type: String,
      unique: true
    },
    fb_url: {
      type: String,
      unique: true
    },
    bd_uni: {
      type: String,
    },
    undergradcgpa: {
      type: Number,
    },
    gretotal: {
      type: Number,
    },
    grevarbal: {
      type: Number,
    },
    grequant: {
      type: Number,
    },
    greawa: {
      type: Number,
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
      type: Number
    },
    research_experience: {
      type: Number
    },
    applied_university: {
      type: String
    },
    accepted_university: {
      type: String
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
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" }
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

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      username: this.username,
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
  return {
    email: this.email,
    confirmed: this.confirmed,
    name: this.name,
    phone: this.phone,
    fb_url: this.fb_url,
    bd_uni: this.bd_uni,
    undergradcgpa: this.undergradcgpa,
    gretotal: this.gretotal,
    grevarbal: this.grevarbal,
    grequant: this.grequant,
    greawa: this.greawa,
    toefltotal: this.toefltotal,
    toeflreading: this.toeflreading,
    toeflwriting: this.toeflwriting,
    toefllistening: this.toefllistening,
    toeflspeaking: this.toeflspeaking,
    publication_number: this.publication_number,
    job_experience: this.job_experience,
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
